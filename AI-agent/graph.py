import json
from langgraph.graph import StateGraph, START, END # type: ignore
from IPython.display import Image, display
from langchain_core.runnables.graph import CurveStyle, MermaidDrawMethod, NodeStyles

from nodes import (
    analyze_convo,
    llm_call_router,
    formulate_response,
    comic_collection,
    unsure,
    route_decision,
    trivia
)
from models import State



router_builder = StateGraph(State)
router_builder.add_node("analyze_convo", analyze_convo)
router_builder.add_node("llm_call_router", llm_call_router)
router_builder.add_node("comic_collection", comic_collection)
router_builder.add_node("formulate_response", formulate_response)
router_builder.add_node("unsure", unsure)
router_builder.add_node("trivia", trivia)

router_builder.add_edge(START, "analyze_convo")
router_builder.add_edge("analyze_convo", "llm_call_router")
router_builder.add_conditional_edges("llm_call_router", route_decision,{ "comic_collection": "comic_collection", "unsure": "unsure", "trivia": "trivia"})
router_builder.add_edge("comic_collection", "formulate_response")
router_builder.add_edge("formulate_response", END)
router_builder.add_edge("trivia", END)
router_builder.add_edge("unsure", END)





router_workflow = router_builder.compile()

# graph = router_workflow.get_graph()
# graph.print_ascii()
