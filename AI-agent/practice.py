from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_community.vectorstores import FAISS
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
import faiss
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing_extensions import Literal
import json
import os
from google.ai.generativelanguage_v1beta.types import Tool as GenAITool  
from helper_functions import google_search, get_update_details


load_dotenv()

api_key = os.environ['API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)






characters = {"spiderman": "hero", "batman": "hero"}

empty = {}

example = {"status": True for _ in empty.keys()}

print(example)