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



class AgeOfQueen(BaseModel):
    age: int = Field(description="the age of the queen of england")


load_dotenv()

api_key = os.environ['API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)

# image = f"data:image/jpeg;base64,{image_data}"
# message = HumanMessage(
#     content=[
#         {
#             "type": "text",
#             "text": "What's in this image?",
#         },
#         {"type": "image_url", "image_url": "https://picsum.photos/seed/picsum/200/300"},
#     ],
#     tools=[GenAITool(google_search={})],  
# )
# result = llm.invoke([message])
# print(result.content)

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
# def delete_issue_descriptions(doc):
#     print(type(doc))
#     if "issueRundown" in doc:
#         del doc["issueRundown"]
#     elif isinstance(doc, dict):
#         print(True)
#         return 
#     return doc    


message = HumanMessage(
        content=[
            {
                "type": "text",
                "text": "how old is the queen of engalnd, (can you confirm if you are using googlesearch or other otuside reults i am tesing a prompt style using google search from gemini)",
            }
        ],
    )
    
res = llm.invoke([message], tools=[GenAITool(google_search={})])

print(res)