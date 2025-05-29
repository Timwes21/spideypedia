from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from google import genai
import os
from langchain_core.messages import HumanMessage, SystemMessage
from models import Tasks
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from llm import get_filter_and_update_keys_for_add_from_llm, get_filter_and_update_keys_for_remove_from_llm, get_update_details_from_llm, llm
from models import convert_names_for_comic_details, comicBookDbTemplate, issueRundownTemplate

def google_search(content):
    api_key = os.environ['API_KEY']
    client = genai.Client(api_key=api_key)
    model_id = "gemini-2.0-flash"
    google_search_tool = Tool(
        google_search = GoogleSearch()
    )
    
    response = client.models.generate_content(
        model=model_id,
        contents=content,
        config=GenerateContentConfig(
            tools=[google_search_tool],
            response_modalities=["TEXT"],
        )
    )
    parts = response.candidates[0].content.parts
    search_results = ""
    for part in parts:
        search_results += part.text
    print(search_results)
    return search_results


def get_filter_and_update_keys(task, label):
    is_add = label == "$set"
    action = "add" if is_add else "remove"
    llm = get_filter_and_update_keys_for_add_from_llm if is_add else get_filter_and_update_keys_for_remove_from_llm
    update_and_filter = llm.invoke([
            SystemMessage(
                content=f"You are part of an agentic system that handles operations for a comic collection being handled in mongodb. It is structured like {comicBookDbTemplate}, produce an update feild to {action} what the user wants to and be sure to make the update field in dot notation"
            ),
            HumanMessage(content=task)
        ]
    )
    return update_and_filter


def format_comic_details(comic_details):
    formatted_details = {}
    for key, value in comic_details.items():
        if "No" not in value:
            new_key = convert_names_for_comic_details[key]
            formatted_details[new_key] = value
    return formatted_details


def get_update_details(user_input):
    content = f"the user want to add something to their comic collection being handles in mondodb and is structured like {comicBookDbTemplate} give me an update key and the content that is being $set, user input: {user_input}"
    result = get_update_details_from_llm.invoke(content)
    return result


def get_tasks_chain(user_input):
    parser = PydanticOutputParser(pydantic_object=Tasks)
    prompt = ChatPromptTemplate.from_template("You are part of an agentic system, which handles the users comic collection, create a list of tasks based on how many actions the user wants to execute with their collection, if the user is adding a comic issue plaese make sure the action is add_comic, if adding anyting else do add_general. The program hinges on the distinction between add_general and add_comics. If removing you can return remove and if asking about the collection return check_collection: {user_input} {format}").partial(format=parser.get_format_instructions())
    chain = prompt | llm | parser
    return chain.invoke({"user_input": user_input})

