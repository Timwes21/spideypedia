from langchain_google_genai import ChatGoogleGenerativeAI
import os 
import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from dotenv import load_dotenv
load_dotenv()

api_key = os.environ['GOOGLE_API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)

from models import (
    Route,
    ComicDetails,
    UpdateComics,
    FilterAndUpdateForAdd,
    FilterAndUpdateForRemove,
    Aggregates,
    Tasks,
    State,
    comicBookDbTemplate
)



router = llm.with_structured_output(Route)
get_comic_details = llm.with_structured_output(ComicDetails)
get_update_details_from_llm = llm.with_structured_output(UpdateComics)
get_filter_and_update_keys_for_add_from_llm = llm.with_structured_output(FilterAndUpdateForAdd)
get_filter_and_update_keys_for_remove_from_llm = llm.with_structured_output(FilterAndUpdateForRemove)
get_tasks = llm.with_structured_output(Tasks)

def get_aggregates(task, state: State):
    parser = PydanticOutputParser(pydantic_object=Aggregates)
    format_instructions = parser.get_format_instructions()
    prompt = ChatPromptTemplate.from_template("the user wants to check on their comic collection being handled by mongodb give an array of aggregates based on the users input, here is the strutcure of the db {db_structure} and here is their token: {token}  {task}  {format_instructions}").partial(format_instructions=format_instructions, token=state["token"], db_structure=json.dumps(comicBookDbTemplate))
    get_aggregates_chain = prompt | llm | parser
    result = get_aggregates_chain.invoke({"task": task})
    return result.aggregates