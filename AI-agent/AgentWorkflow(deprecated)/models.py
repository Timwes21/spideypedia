from pydantic import BaseModel, Field
from typing import Optional


class Convo(BaseModel):
    convo: list[str] = Field(description="the conversation and further context ")
    context: Optional[str] = Field(description="any context that might be relavant")

class Query(BaseModel):
    query: str = Field(description="query to search for needed info")

class SummaryOfConvo(BaseModel):
    summary: str = Field(description='a summary of the current convo with only necessary details')