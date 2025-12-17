from minio import Minio
from dotenv import load_dotenv
import os

load_dotenv()

url = os.environ["MINIO_URL"]
a = os.environ["MINIO_ACCESS_KEY"]

client = Minio(endpoint=url,
    secure=True,
    access_key=a,
    secret_key=a,
)