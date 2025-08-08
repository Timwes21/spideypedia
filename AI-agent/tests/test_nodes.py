import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from nodes import (
    llm_call_router,
    route_decision,
    unsure,
    trivia,
    formulate_response,
    comic_collection
)
import pytest
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

from utils.db import practice_collection


list_of_actions = ["trivia", "comic_collection", "unsure"]

def test_llm_call_router():
    messages = [AIMessage("how are you"), HumanMessage("i am well thank you for asking"), AIMessage("ok let me know if you need anything"), HumanMessage("Can you tell me when the queen died")]
    result = llm_call_router({"input": "add amazing spiderman issue 1", "chat": messages})
    assert result['decision'] in list_of_actions
    
def test_route_decision():
    result = route_decision({"decision": "unsure"})
    assert result in list_of_actions
    
def test_unsure():
    result = unsure({"input": "boogers"})
    assert isinstance(result['output'], str)
    
def test_trivia():
    result = trivia({"input": "When was spiderman the movie released"})
    assert isinstance(result['output'], str)
    
def test_formulate_response():
    result = formulate_response({"input": "add amazing spiderman", "results": {"modifiedCount": 1, "matchedCount": 1}})
    assert isinstance(result['output'], str) 
    
@pytest.mark.asyncio
async def test_comic_collection():
    result = await comic_collection({"input": "add amazing spiderman", "token": "token", "collection": practice_collection})
    assert isinstance(result['results'], dict)