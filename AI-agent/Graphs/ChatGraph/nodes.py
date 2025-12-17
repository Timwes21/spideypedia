from utils.llm import router, llm
from langchain_core.messages import HumanMessage, SystemMessage
from Graphs.ChatGraph.actions import actions
from utils.print_line import print_header
from utils.helper_functions import google_search, get_tasks_chain, get_chain
from utils.schemas import State, Route, Aggregates, comicBookDbTemplate
from utils.redis_pub import publish
import json



@print_header(action="llm_call_router")
async def llm_call_router(state: State):
    prompt = """You are being used in a comic collection application where you, 
    - update the comic collection
    - check the comic collection

    If the user is asking to add, remove or update an issue then you are to route to update_comic_collecttion
    - 'add captain america 200 vol 1', 'remove captain america 200 vol 1'
    
    if the user is asking to check their collection, then route to check_comic_collection
    - 'do i have and amazing spiderman issues', 'do i have captain america issue 12 vol 2' 

    if its are to tell route to unsure


    input: {input} {format}"""
    chain = get_chain(Route, prompt)
    decision: Route = await chain.ainvoke({"input": state["input"]})
    print(decision)
    return {"decision": decision.step}




def route_decision(state: State):
    return state["decision"]

    
@print_header(action="unsure")
async def unsure(state: State):
    res = await llm.ainvoke(f"You are part of an agentic system that helps with the users comic tracking with the help of mongodb, and a comic book expert, the user has given a response that is uncertain of what they want, form a short response, chat, they can ask trivia, and update their collection: {state['input']}")
    print(res.content)
    return {"output": res.content}


@print_header(action="trivia")
async def trivia(state: State):
    content = "You are a comic expert and you need to anwser the users question, i am giving you the full convo for context: " + state["chat"]
    goolge_result = await google_search(content)
    print(goolge_result)
    return {"output": goolge_result}
        


@print_header(action="update_comic_collection")
async def update_comic_collection(state: State):
    tasks = await get_tasks_chain(state["input"])
    token = state["token"]
    results = {}
    print(tasks)
    
    collection = state["collection"]
    state_before_update = await collection.find_one({"tokens": token}, {"_id": 0, "characters": 1}) 
    await collection.update_one({"tokens": token}, {"$set": {"previous characters": state_before_update}})
    
    for current_task in tasks.tasks:
        task = current_task["task"]
        action = current_task["action"]
        result = await actions[action](task, state)
        results[action] = result
        await publish(token)
        
    return {"results": results}


@print_header(action="check_comic_collection")
async def check_comic_collection(task, state: State):
    prompt = "the user wants to check on their comic collection being handled by mongodb give an array of aggregates based on the users input, here is the strutcure of the db {db_structure} and here is their token: {token}  {task}  {format_instructions}"
    chain = get_chain(Aggregates, prompt)
    chain_result: Aggregates = await chain.ainvoke({"task": task, "token": state["token"], "db_structure": json.dumps(comicBookDbTemplate)})
    aggregates = chain_result.aggregates
    result = list(state['collection'].aggregate(aggregates))
    return {"result": result}



@print_header(action="formulate-response")
async def formulate_response(state: State):
    results = state["results"]
    user_input = state["input"]
    response = await llm.ainvoke([
            SystemMessage(
                content=f"""You are part of an agentic system that maanges a users comic collection
                Here are the results for what the user is asking: {results} 
                
                be sure to create a short response explaining the success or failure of a task, but 
                please keep it short and simple, you are not a full on chatbot"""
            ),
            HumanMessage(content=user_input)
        ]
    )
    
    return {"output": response.content}
