import redis.asyncio as redis
import json
# import redis
import os 
from dotenv import load_dotenv
load_dotenv()

url = os.environ['REDIS_URL']
r = redis.from_url(url, decode_responses=True)

# Publish function
async def publish(token: str):
    await r.publish("charUpdates", token)



