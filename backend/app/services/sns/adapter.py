import hashlib
import hmac

from ...config import Settings
from .client import SnsClient
from .exceptions import SnsUnavailableError
from .schemas import SnsExecutionRequest


class SnsAdapter:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = SnsClient(settings)

    def start(self, workflow_id: str, payload: dict, execution_id: str | None = None) -> dict:
        sns_payload = {**payload}
        if execution_id:
            sns_payload["execution_id"] = execution_id
        result = self.client.start_execution(SnsExecutionRequest(workflow_id=workflow_id, callback_url=self.settings.sns_callback_url, payload=sns_payload))
        return {"execution_id": result.execution_id, "status": result.status, "raw": result.raw}

    def verify_webhook(self, body: bytes, signature: str | None) -> bool:
        secret = self.settings.sns_webhook_secret
        if not secret:
            return False
        if not signature:
            return False
        if self.settings.sns_webhook_auth_mode == "shared_secret":
            return hmac.compare_digest(secret, signature)
        expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

    @property
    def configured(self) -> bool:
        return bool((self.settings.sns_master_workflow_url or self.settings.sns_execution_url_template) and self.settings.sns_master_workflow_id)
