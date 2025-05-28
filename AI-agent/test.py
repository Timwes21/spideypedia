from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
from pydantic import BaseModel
from typing_extensions import Literal
import json
import os


load_dotenv()

api_key = os.environ['GOOGLE_API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)


class ConvoState(BaseModel):
    convo_status: Literal["Ended", "Ongoing"]

chat = []

while True:
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
    
    print(result)
    
    