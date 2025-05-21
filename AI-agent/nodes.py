from langchain_core.messages import HumanMessage, SystemMessage
from models import State
from db import actions
from augmented_llms import(
    router,
    get_tasks)
from helper_functions import google_search
from llm import llm
from models import comicBookDbTemplate



def llm_call_router(state: State):
    """Route the input to the appropriate node"""

    decision = router.invoke(
        [
            SystemMessage(
                content=f"The users comic collection has this structure in mongodb:{comicBookDbTemplate} Route the input to trivia, unsure or comic_collection"
            ),
            HumanMessage(content=state["input"]),
        ]
    )

    return {"decision": decision.step}




def route_decision(state: State):
    return state["decision"]

    

def unsure(state: State):
    output = llm.invoke([
            SystemMessage(
                content=f"You are part of an agentic system that helps with the users comic tracking with the help of mongodb, and a comic book expert, the user has given a response that is uncertain of what they want, form a short response"
            ),
            HumanMessage(content=state['input'])
        ]
    )
    return {"output": output.content}

def trivia(state: State):
    content = "You are a comic expert and you need to anwser the users question: " + state["input"]
    result = google_search(content)
    return {"output": result}
    

def formulate_response(state: State):
    results = state["results"]
    user_input = state["input"]
    response = llm.invoke([
            SystemMessage(
                content=f"You are part of an agentic system that maanges a users comic collection, and here are the results: {results}, be sure to create a short response explaining the success or failure of a task"
            ),
            HumanMessage(content=user_input)
        ]
    )
    
    return {"agent_response": response.content}


def comic_collection(state: State):
    tasks = get_tasks.invoke(
        [
            SystemMessage(
                content=f"You are part of an agentic system, which handles the users comic collection, create a list of tasks based on how many actions the user wants to execute with their collection, and if the user as adding multiple issues break each issue into a seperate task"
            ),
            HumanMessage(content=state['input'])
        ]
    )
    results = {}
    print(tasks)
    
    for current_task in tasks['tasks']:
        task = current_task["task"]
        action =  current_task["action"]
        result = actions[action](task, state)
        results[action] = result
        
    return {"results": results}
