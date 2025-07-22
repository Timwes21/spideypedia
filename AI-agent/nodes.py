from langchain_core.messages import HumanMessage, SystemMessage
from actions import actions
from llm import router, llm
from helper_functions import google_search, get_tasks_chain
from models import State, Route
from redis_pub import publish
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate






def llm_call_router(state: State):
    """Route the input to the appropriate node"""
    print("*******************************************llm_call_router**********************************************")
    parser = PydanticOutputParser(pydantic_object=Route)
    prompt = ChatPromptTemplate.from_template("You are being used in a comic collection application where you, the asi assistant can either update the users comic collection like adding removing or updating things, or answering trivia questions, based on the users input route the input to trivia or comic_collection. If nothing from the users input makes sense in regaurds to the application route to unsure {input} {format}").partial(format=parser.get_format_instructions())
    chain = prompt | llm | parser
    decision = chain.invoke({"input":state["input"]})
    print(decision)

    return {"decision": decision.step}




def route_decision(state: State):
    return state["decision"]

    

def unsure(state: State):
    print("*******************************************unsure**********************************************")
    output = llm.invoke([
            SystemMessage(
                content=f"You are part of an agentic system that helps with the users comic tracking with the help of mongodb, and a comic book expert, the user has given a response that is uncertain of what they want, form a short response"
            ),
            HumanMessage(content=state['input'])
        ]
    )
    print(output.content)
    return {"output": output.content}

def trivia(state: State):
    print("*******************************************trivia**********************************************")
    content = "You are a comic expert and you need to anwser the users question: " + state["input"]
    result = google_search(content)
    print(result)
    return {"output": result}
        

def formulate_response(state: State):
    print("***************************************formulate_response**************************************")
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
    print("*************************************comic_collection*****************************************")
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
