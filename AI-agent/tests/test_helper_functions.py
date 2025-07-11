from helper_functions import (
    google_search,
    get_filter_and_update_keys,
    format_comic_details,
    get_update_details,
    get_tasks_chain
)

from models import FilterAndUpdateForAdd, FilterAndUpdateForRemove, convert_names_for_comic_details, UpdateComics, issueRundownTemplate, ComicDetails, Tasks

    
    
def test_get_filter_and_update_keys():
    result = get_filter_and_update_keys("add amazing spiderman issue 1", "$set")
    assert isinstance(result, FilterAndUpdateForRemove) or isinstance(result, FilterAndUpdateForAdd)
    
    
def test_comic_details():
    data = {
    "name": "The Chameleon Strikes",
    "artist": "Steve Ditko",
    "writer": "Stan Lee",
    "first_appearances": "May 1962",
    "major_deaths": "Fred",
    "story_arc": "Spider strikes part 1",
    }
    result: dict = format_comic_details(data)
    for i in result.keys():
        assert i in convert_names_for_comic_details.values()
        
def test_get_update_details():
    details_results = get_update_details("add amazing spiderman issue 1")
    assert isinstance(details_results, UpdateComics) 
    
def test_get_tasks_chain():
    task = "add amazing spiderman issue 1"
    assert isinstance(get_tasks_chain(task), Tasks)
    
