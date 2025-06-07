from langchain_core.messages import HumanMessage, SystemMessage
from actions import actions
from llm import router
from helper_functions import google_search, get_tasks_chain
from llm import llm
from models import comicBookDbTemplate, State
from redis_pub import publish
import time





def llm_call_router(state: State):
    """Route the input to the appropriate node"""
    
    messages = [SystemMessage("You are being used in a comic collectio application, Route the input to trivia, unsure or comic_collection based on the recent input, and previous conversations")]
    messages += state["chat"]
    decision = router.invoke(messages)

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
    
    return {"output": response.content}


async def comic_collection(state: State):
    tasks = get_tasks_chain(state["input"])
    token = state["token"]
    results = {}
    print(tasks)
    
    collection = state["collection"]
    state_before_update = collection.find_one({"tokens": token}, {"_id": 0, "characters": 1}) 
    collection.update_one({"tokens": token}, {"$set": {"previous characters": state_before_update}})
    
    for current_task in tasks.tasks:
        task = current_task["task"]
        action = current_task["action"]
        result = actions[action](task, state)
        results[action] = result
        print(type(token))
        await publish(token)
        
    return {"results": results}
