import json
from langgraph.graph import StateGraph, START, END # type: ignore


router_builder = StateGraph(State)

router_builder.add_node("unsure", unsure)
router_builder.add_edge(START, "llm_call_router")





# Compile workflow
router_workflow = router_builder.compile()

# Invoke
state = router_workflow.invoke({"input": "add amazing spiderman issue 13", "token": "dysvuyihinjxbsvdg"})
print(state)

# result = wikipedia.run(" release date, write, artist of amazing spiderman comic issue number 1")
# print(result)