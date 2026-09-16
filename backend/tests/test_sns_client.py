from unittest.mock import Mock, patch

import httpx
import pytest

from app.config import Settings
from app.services.sns.client import SnsClient
from app.services.sns.exceptions import SnsResponseError
from app.services.sns.schemas import SnsExecutionRequest


def test_master_workflow_posts_existing_event_envelope_with_execution_context():
    settings = Settings(
        sns_master_workflow_id="master-workflow",
        sns_master_workflow_url="https://example.test/master",
        sns_callback_url="https://prism.example.test/api/sns/webhook",
    )
    response = Mock(status_code=200)
    response.json.return_value = {"execution_id": "sns-execution-1", "status": "started"}

    with patch("app.services.sns.client.httpx.post", return_value=response) as post:
        result = SnsClient(settings).start_execution(
            SnsExecutionRequest(
                workflow_id="master-workflow",
                callback_url=settings.sns_callback_url,
                payload={"event_id": "event-1", "execution_id": "prism-execution-1"},
            )
        )

    post.assert_called_once_with(
        "https://example.test/master",
        headers={"Accept": "application/json", "Content-Type": "application/json"},
        json={
            "callback_url": "https://prism.example.test/api/sns/webhook",
            "payload": {"event_id": "event-1", "execution_id": "prism-execution-1"},
        },
        timeout=15.0,
    )
    assert result.execution_id == "sns-execution-1"
    assert result.status == "started"


@pytest.mark.parametrize("status_code", [200, 202])
def test_successful_acknowledgement_without_execution_id_is_a_successful_dispatch(status_code):
    settings = Settings(
        sns_master_workflow_id="master-workflow",
        sns_master_workflow_url="https://example.test/master",
        sns_callback_url="https://prism.example.test/api/sns/webhook",
    )
    response = Mock(status_code=status_code)
    response.json.return_value = {}

    with patch("app.services.sns.client.httpx.post", return_value=response):
        result = SnsClient(settings).start_execution(
            SnsExecutionRequest(
                workflow_id="master-workflow",
                callback_url=settings.sns_callback_url,
                payload={"execution_id": "prism-execution-1"},
            )
        )

    assert result.execution_id is None


def test_successful_acknowledgement_with_empty_body_is_a_successful_dispatch():
    settings = Settings(
        sns_master_workflow_id="master-workflow",
        sns_master_workflow_url="https://example.test/master",
    )
    response = Mock(status_code=200)
    response.json.side_effect = ValueError("empty response body")

    with patch("app.services.sns.client.httpx.post", return_value=response):
        result = SnsClient(settings).start_execution(SnsExecutionRequest(workflow_id="master-workflow"))

    assert result.execution_id is None


def test_non_successful_sns_response_remains_an_error():
    settings = Settings(
        sns_master_workflow_id="master-workflow",
        sns_master_workflow_url="https://example.test/master",
    )
    response = Mock(status_code=500)
    response.raise_for_status.side_effect = httpx.HTTPStatusError(
        "server error", request=Mock(), response=response
    )

    with patch("app.services.sns.client.httpx.post", return_value=response):
        with pytest.raises(SnsResponseError, match="SNS execution request failed"):
            SnsClient(settings).start_execution(SnsExecutionRequest(workflow_id="master-workflow"))