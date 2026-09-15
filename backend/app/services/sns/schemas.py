from pydantic import BaseModel, Field


class SnsExecutionRequest(BaseModel):
    workflow_id: str
    callback_url: str | None = None
    payload: dict = Field(default_factory=dict)


class SnsExecutionResponse(BaseModel):
    execution_id: str
    status: str | None = None
    raw: dict = Field(default_factory=dict)
