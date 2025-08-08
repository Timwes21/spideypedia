from langchain_core.tools import tool
from langgraph.types import Command, Send
import models 
from ..utils.helper_functions import google_search as google



@tool("pass_to_update_agent", description="pass to the update agent", args_schema=models.Convo)
def pass_to_update_agent(convo: list, context=None):
    prompt = f"here is the current convo: {convo}, "
    if context != None:
        prompt =[prompt, f"here is further context: {context}"]
        prompt = ", ".join(prompt)
    return Command(
        goto=Send("update_agent", {"messages": prompt}),
        graph=Command.PARENT
    )

@tool("pass_to_trivia_agent", description="passes to trivia agent", args_schema=models.Convo)
def pass_to_trivia_agent(convo, context=None):
    prompt = f"here is the current convo: {convo}, "
    if context != None:
        prompt =[prompt, f"here is further context: {context}"]
        prompt = ", ".join(prompt)
    return Command(
        goto=Send("trivia_agent", {"messages": prompt}),
        graph=Command.PARENT
    )

@tool("pass_to_response_agent", description="passes to the response agent", args_schema=models.Convo)
def pass_to_response_agent(convo, context=None):
    prompt = f"here is the current convo: {convo}, "
    if context != None:
        prompt =[prompt, f"here is further context: {context}"]
        prompt = ", ".join(prompt)
    return Command(
        goto=Send("response_agent", {"messages": prompt}),
        graph=Command.PARENT
    )



tool("google_search", description="google search for relavant info", args_schema=models.Query)
def google_search(query):
    return google(query)

@tool("mark_end_of_convo", description="marks end of convo", args_schema=models.SummaryOfConvo)
def mark_end_of_convo(summary):
    ...

