from contextlib import asynccontextmanager
from utils.db import get_mongo_collection
from fastapi import FastAPI
from utils.minio_client import client



@asynccontextmanager
async def lifespan(app: FastAPI):
    collection, client = get_mongo_collection()
    app.state.collection = collection
    app.state.minio_client = client

    yield
    client.close()
