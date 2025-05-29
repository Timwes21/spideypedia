from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()


url = os.environ["URL"]
client = MongoClient(url)
db = client["comicManagement"]
production_collection = db["users"]
practice_collection = db["test"]




