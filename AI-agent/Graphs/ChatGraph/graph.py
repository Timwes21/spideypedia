import json
from langgraph.graph import StateGraph, START, END # type: ignore
from IPython.display import Image, display
from langchain_core.runnables.graph import CurveStyle, MermaidDrawMethod, NodeStyles

from Graphs.ChatGraph.nodes import (
    llm_call_router,
    formulate_response,
    update_comic_collection,
    unsure,
    route_decision,
    trivia,
    check_comic_collection
)
from utils.schemas import State



router_builder = StateGraph(State)
router_builder.add_node("llm_call_router", llm_call_router)
router_builder.add_node("update_comic_collection", update_comic_collection)
router_builder.add_node("check_comic_collection", check_comic_collection)
router_builder.add_node("unsure", unsure)
router_builder.add_node("trivia", trivia)
router_builder.add_node("formulate_response", formulate_response)

router_builder.add_edge(START, "llm_call_router")
router_builder.add_conditional_edges("llm_call_router", route_decision,{ "update_comic_collection": "update_comic_collection", "unsure": "unsure", "check_comic_collection": "check_comic_collection"})
router_builder.add_edge("update_comic_collection", "formulate_response")
router_builder.add_edge("check_comic_collection", "formulate_response")
router_builder.add_edge("formulate_response", END)
router_builder.add_edge("unsure", END)




graph = router_builder.compile()

graph_display = graph.get_graph()
graph_display.print_ascii()
