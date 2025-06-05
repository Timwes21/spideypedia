import redis.asyncio as redis
import redis
import os 
from dotenv import load_dotenv
load_dotenv()

url = os.environ['REDIS_URL']
redis_pub = redis.from_url(url)

# Publish function
async def publish(token: str):
    await redis_pub.publish("charUpdates", token)
