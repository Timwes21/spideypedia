from langgraph.prebuilt import create_react_agent
from ..utils.llm import llm
from tools import (
    pass_to_response_agent,
    pass_to_trivia_agent,
    pass_to_update_agent,
    google_search
)




router_agent = create_react_agent(
    model=llm,
    prompt="You are being used in a comic collection application, and you are to route ti the proper agent:" \
    "The tools you have acces to are:" \
    "- pass_to_update_agent" \
    "- pass_to_trivia_agent" \
    "- get_context" \
    "- pass_to_response_agent" \
    "" \
    "If the user wants to add or remove something you are to pass to the remove agent" \
    "if the agent is asking general trivia" \
    "if you are usure of what is being asked then pass to the get_context where you will get context" \
    "if context is not enough or unsatisfactory, pass to the response agent",
    tools=[pass_to_update_agent, pass_to_trivia_agent, get_context, pass_to_response_agent]


)


update_agent = create_react_agent(
    model=llm,
    prompt="You are being used in a comic collection app. Your job is to add to the users collection," \
    "the tools you have access to are:" \
    "- pass_to_response_agent" \
    "- execute_tasks" \
    "" \
    "call the tool execute_tasks by passing the users content, then pass the status of the updates to th response agent" \
    "then pass the results to the response agent",
    tools=[pass_to_response_agent, execute_tasks]
)


trivia_agent = create_react_agent(
    model=llm,
    prompt="You are a comic book expert, you are to answer the users comic trivia question" \
    "The tool you have access to are:" \
    "- google_search" \
    "- pass to response_agent" \
    "" \
    "Google search the topic so you are not ill informaed because even experts make mistakes" \
    "once you have the knowledge pass to the response agent",
    tools=[google_search, pass_to_response_agent]
)

response_agent = create_react_agent(
    model=llm,
    prompt="You are to come up with a reply based on what the previous agent has passed to you" \
    "The tools you have access to are:" \
    "- mark_end_of_convo" \
    "- reply_to_user" \
    "" \
    "if it seems like the end of the conversation, use mark_end_of_convo, but if you do mark end of convo," \
    "send in a summary of the convo, getting rid of any verboseness or unrelated info" \
    "use the convo as a reference to see what is known." \
    "no mattr what you are to end with reply to use" \
    "" \
    "criteria for convo summarization:" \
    "- summarize only necessary info, no fluff" \
    "- if the agent did not know somehting and it seems important about the user, add it to the summariztion" \
    "if the agent did already know about it, it is already known so dont include it" \
    "",
    tool=[mark_end_of_convo, reply_to_user]
)