from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_community.vectorstores import FAISS
from langchain_core.messages import HumanMessage, SystemMessage
import faiss
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing_extensions import Literal
import json
import os
from google.ai.generativelanguage_v1beta.types import Tool as GenAITool  



class Queen(BaseModel):
    age: int = Field(description="the age of the queen of england")
    place_of_birth: str = Field(description="the queens birthplace")


load_dotenv()

api_key = os.environ['API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)


characters = {
    "Spider-man": {
      "Series": {
        "Amazing Spider-man": {
          "vol 1": {
            "1": {
              "issueRundown": {
                "Artist": "Steve Ditko",
                "Publication Date": "March 1963",
                "Story Arc": "N/A",
                "First Appearances": "J. Jonah Jameson, John Jameson, Chameleon",
                "Writer": "Stan Lee",
                "Crossovers": "First meeting between Spider-Man and the Fantastic Four",
                "Name": "Spider-Man: Freak! Public Menace! ; The Chameleon Strikes!"
              }
            }
          }
        }
      }
    }
  }


parser = PydanticOutputParser(pydantic_object=Queen)
system_message = SystemMessage(
        content=[
            {
                "type": "text",
                "text": "answer the users question with google search tool grounding the asnwer",
            }
        ],
    )
    

message = HumanMessage(
    content=[
        {"type": "text", "text": f"how old is the queen of engalnd, and where was she born {parser.get_format_instructions()}"}
    ]
)

my_dict = {"be": "be", "a": 1}


for i, j in my_dict.items():
    if j == "be":
        del my_dict[i]
        
print(my_dict)