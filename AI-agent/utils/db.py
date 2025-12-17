from typing import Literal
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os, certifi
load_dotenv()

url = os.environ["URL"]

def get_mongo_collection(collection_name: Literal["users", "test"] = "users"):
    client = AsyncIOMotorClient(url)
    db = client["comicManagement"]
    return db[collection_name], client






