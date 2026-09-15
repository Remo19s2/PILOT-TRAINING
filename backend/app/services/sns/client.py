import httpx
import logging

from ...config import Settings
from .exceptions import SnsResponseError, SnsUnavailableError
from .schemas import SnsExecutionRequest, SnsExecutionResponse

logger = logging.getLogger("prism.sns")


class SnsClient:
    def __init__(self, settings: Settings):
        self.settings = settings

    def start_execution(self, request: SnsExecutionRequest) -> SnsExecutionResponse:
        if request.workflow_id == self.settings.sns_master_workflow_id and self.settings.sns_master_workflow_url:
            url = self.settings.sns_master_workflow_url
        else:
            template = self.settings.sns_execution_url_template
            if not template:
                raise SnsUnavailableError("SNS_EXECUTION_URL_TEMPLATE is not configured")
            url = template.format(workflow_id=request.workflow_id)
        headers = {"Accept": "application/json", "Content-Type": "application/json"}
        if self.settings.sns_api_key:
            headers["Authorization"] = f"Bearer {self.settings.sns_api_key}"
        try:
            response = httpx.post(url, headers=headers, json={"callback_url": request.callback_url, "payload": request.payload}, timeout=self.settings.sns_timeout_seconds)
            logger.info("SNS request completed with status=%s", response.status_code)
            response.raise_for_status()
            data = response.json()
        except (httpx.HTTPError, ValueError) as error:
            raise SnsResponseError(f"SNS execution request failed: {error}") from error
        logger.info("SNS response received with fields=%s", sorted(data) if isinstance(data, dict) else [])
        execution_id = data.get("execution_id") if isinstance(data, dict) else None
        if not execution_id:
            raise SnsResponseError("SNS response did not contain execution_id")
        return SnsExecutionResponse(execution_id=str(execution_id), status=data.get("status"), raw=data)
