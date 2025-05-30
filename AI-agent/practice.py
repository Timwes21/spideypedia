from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from langchain_core.messages import HumanMessage, SystemMessage
import faiss
from dotenv import load_dotenv
from pydantic import BaseModel
from typing_extensions import Literal
import json
import os

load_dotenv()

api_key = os.environ['API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)


class ConvoState(BaseModel):
    convo_status: Literal["Ended", "Ongoing"]

chat = []
import redis
import time
import os
from dotenv import load_dotenv
load_dotenv()
host = os.environ['REDIS_LOCAL_HOST']
port = os.environ['REDIS_PORT']


r = redis.Redis(host=host, port=port, decode_responses=True)

token = "token"
key = f"{token}:chat_timer"
start = time.time()



    

while True:
    # if time.time() - start > 3600: 
    user_input = input("You: ")
    chat += [{"role": "user", "content": user_input}]
    result = llm.invoke(chat)
    chat += [{"role": "assistant", "content": result.content}]
    print(result.content)
    print(chat)
    parser = PydanticOutputParser(pydantic_object=ConvoState)
    prompt = ChatPromptTemplate.from_template("Ananlyze this convo and tell me if if looks like the convo is ongoing or it has ended {convo} {format} ").partial(format=parser.get_format_instructions())
    chain = prompt | llm | parser
    result = chain.invoke({"convo": json.dumps(chat)})
    if result.convo_status is "Ended":
        r.set(key, start)
        
    
    print(result)


    