from models import (
    Route,
    ComicDetails,
    UpdateComics,
    FilterAndUpdateForAdd,
    FilterAndUpdateForRemove,
    Aggregates,
    Tasks
)

from llm import llm


router = llm.with_structured_output(Route)
get_comic_details = llm.with_structured_output(ComicDetails)
get_update_details_from_llm = llm.with_structured_output(UpdateComics)
get_filter_and_update_keys_for_add_from_llm = llm.with_structured_output(FilterAndUpdateForAdd)
get_filter_and_update_keys_for_remove_from_llm = llm.with_structured_output(FilterAndUpdateForRemove)
get_aggregates = llm.with_structured_output(Aggregates)
get_tasks = llm.with_structured_output(Tasks)
