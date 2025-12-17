from langchain_google_genai import ChatGoogleGenerativeAI
import os 
from dotenv import load_dotenv
load_dotenv()

api_key = os.environ['API_KEY']
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=api_key)



from utils.schemas import (
    Route,
    ComicDetails,
    UpdateComics,
    FilterAndUpdateForAdd,
    FilterAndUpdateForRemove,
    Tasks
)



router = llm.with_structured_output(Route)
get_comic_details = llm.with_structured_output(ComicDetails)
get_update_details_from_llm = llm.with_structured_output(UpdateComics)
get_filter_and_update_keys_for_add_from_llm = llm.with_structured_output(FilterAndUpdateForAdd)
get_filter_and_update_keys_for_remove_from_llm = llm.with_structured_output(FilterAndUpdateForRemove)
get_tasks = llm.with_structured_output(Tasks)
