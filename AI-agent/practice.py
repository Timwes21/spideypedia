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
from google.ai.generativelanguage_v1beta.types import Tool as GenAITool  




load_dotenv()

# api_key = os.environ['API_KEY']
# llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)

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


new_dict = {}



for character_name, character_contents in characters.items():
    if character_name not in new_dict:
        new_dict[character_name] = {}
    for title_type, titles in character_contents.items():
        if title_type not in new_dict[character_name]:
            new_dict[character_name][title_type] = {}
        for title_name, n in titles.items(): 
            new_dict[character_name][title_type][title_name]={}

            
                

print(new_dict)