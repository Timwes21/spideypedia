from pymongo import MongoClient
from pymongo import AsyncMongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
load_dotenv()


url = os.environ["URL"]
client = MongoClient(url)
db = client["comicManagement"]
production_collection = db["users"]
practice_collection = db["test"]


def get_mongo_collection(collection_name):
    url = os.environ["URL"]
    client = AsyncIOMotorClient(url)
    db = client["work-phone"]
    return db[collection_name], client



