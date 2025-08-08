from utils.llm import router, llm
from langchain_core.messages import HumanMessage, SystemMessage
from actions import actions
from utils.print_line import print_header
from utils.helper_functions import google_search, get_tasks_chain, get_chain
from models import State, Route
from redis_pub import publish
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate





@print_header(action="llm_call_router")
def llm_call_router(state: State):
    """Route the input to the appropriate node"""
    prompt = "You are being used in a comic collection application where you, the asi assistant can either update the users comic collection like adding removing or updating things, or answering trivia questions, based on the users input route the input to trivia or comic_collection. If nothing from the users input makes sense in regaurds to the application route to unsure {input} "
    chain = get_chain(Route, prompt)
    decision: Route = chain.invoke({"input": state["input"]})
    print(decision)
    return {"decision": decision.step}




def route_decision(state: State):
    return state["decision"]

    
@print_header(action="unsure")
def unsure(state: State):
    output = llm.invoke([
            SystemMessage(
                content=f"You are part of an agentic system that helps with the users comic tracking with the help of mongodb, and a comic book expert, the user has given a response that is uncertain of what they want, form a short response"
            ),
            HumanMessage(content=state['input'])
        ]
    )
    print(output.content)
    return {"output": output.content}


@print_header(action="trivia")
def trivia(state: State):
    content = "You are a comic expert and you need to anwser the users question: " + state["input"]
    goolge_result = google_search(content)
    print(goolge_result)
    return {"output": goolge_result}
        
@print_header(action="formulate-response")
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

@print_header("comic_collection")
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
        await publish(token)
        
    return {"results": results}
