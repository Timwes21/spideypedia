import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db import practice_collection
from actions import actions

def test_check_collection():
    result = actions['check_collection']("check if Spider-man is in the collection", {"token": "token", "collection": practice_collection})
    print(result)
    assert isinstance(result['result'], list )


def test_add_comics():
    result = actions['add_comics']("Add Amazing Spider-man issue 1", {"token": "token", "collection": practice_collection})
    assert result.raw_result['ok'] == 1
    
def test_add_general():
    result = actions['add_general']("Add Batman to characters", {"token": "token", "collection": practice_collection})
    assert result.raw_result['ok'] == 1
    
def test_remove():
    result = actions['remove']("Remove Batman from characters",  {"token": "token", "collection": practice_collection})
    assert result.raw_result['ok'] == 1