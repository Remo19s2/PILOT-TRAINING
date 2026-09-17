import hashlib
import hmac
import logging

from ...config import Settings
from .client import SnsClient
from .exceptions import SnsUnavailableError
from .schemas import SnsExecutionRequest

logger = logging.getLogger("prism.sns")


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
        mode = self.settings.sns_webhook_auth_mode

        # "none" mode: skip all verification (useful for open n8n callback endpoints)
        if mode == "none":
            logger.warning("SNS webhook signature verification is disabled (SNS_WEBHOOK_AUTH_MODE=none)")
            return True

        secret = self.settings.sns_webhook_secret
        if not secret:
            logger.warning("SNS_WEBHOOK_SECRET is not configured — rejecting webhook")
            return False
        if not signature:
            logger.warning("SNS webhook request is missing the %s header", self.settings.sns_webhook_signature_header)
            return False

        if mode == "shared_secret":
            # Pad to equal length so compare_digest doesn't raise ValueError on length mismatch
            sig_padded = signature.ljust(len(secret)) if len(signature) < len(secret) else signature
            sec_padded = secret.ljust(len(signature)) if len(secret) < len(signature) else secret
            return hmac.compare_digest(sec_padded, sig_padded) and len(secret) == len(signature)

        # Default: HMAC-SHA256
        expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)

    @property
    def configured(self) -> bool:
        return bool((self.settings.sns_master_workflow_url or self.settings.sns_execution_url_template) and self.settings.sns_master_workflow_id)
