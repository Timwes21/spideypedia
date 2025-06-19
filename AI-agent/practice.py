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
from helper_functions import google_search, get_update_details, google_search_with_filter
from models import ComicDetails


load_dotenv()

api_key = os.environ['API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)

class Test(BaseModel):
    age: int
    name: str




characters = {"spiderman": "hero", "batman": "hero"}

test_list = ['Okay, I will retrieve the necessary information for "Amazing Spider-Man Vol 2 issue 10" and format it according to the provided JSON schema.', '```json\n{"name": "Spider-Man is still hunting the names on his list, and tracks them down to the site of the original accident that brought them all together. There he finds Dr. Octopus a prisoner of Captain Power, and is forced to leave Doc Ock free to pursue Power in his quest to kill Peter\'s boss, Dr. Twaki.", "artist": "John Byrne, Scott Hanna (inks)", "writer": "Howard Mackie", "first_appearances": "Captain Power", "major_deaths": null, "costume_changes": null, "story_arc": null, "crossovers": null, "release_date": "October 1, 1999"}\n```']

result = llm.with_structured_output(ComicDetails).invoke(test_list)

print(result)
