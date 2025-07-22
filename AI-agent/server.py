from fastapi import Request, FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from graph import router_workflow
from db import production_collection
import time
from redis_pub import publish
import base64
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from llm import llm
from models import PhotoUploadInfo, convert_names_for_comic_details
from langchain.output_parsers import PydanticOutputParser
from helper_functions import format_comic_details, get_char_and_title, google_search_with_filter




app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://spideypedia.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


chats = {}



def get_chat(token, start):
    if token in chats:
        if time.time() - start > 3600:     
            del chats[token]
            return []
        return chats[token]
    return []
            




@app.websocket("/ws")
async def talk_to_agent(ws: WebSocket):
    await ws.accept()
    try: 
        while True:
            data = await ws.receive_json()
            start = data.get("start", 1)
            token = data['token']
            user_input = data['input']
            chat = get_chat(token, float(start))
            chat += [ HumanMessage(user_input)]
            print(chat)
            await ws.send_json({"loading": "forming response"})
            state = await router_workflow.ainvoke({"input": user_input, "token": token, "collection": production_collection, "chat": chat})
            output = state['output']
            chat += [AIMessage(output)]
            while len(chat) > 10:
                chat.pop(0) 
            chats[token] = chat
            await ws.send_json({"output": output, "start": time.time()})
            
    except WebSocketDisconnect as e:
        print(e)
        
@app.post("/undo")
async def undo_recent(req: Request):
    data = await req.json()
    token = data["token"]
    restored_state = production_collection.find_one({"tokens": token}, {"previous characters": 1, "_id": 0})
    production_collection.update_one({"tokens": token}, {"$set": {"characters": restored_state["previous characters"]["characters"]}})
    await publish(token)
    
@app.post("/add-by-photo")
async def add_by_photo(file: UploadFile = File(...), token = Form(...)):
    contents = await file.read()
    encoded = base64.b64encode(contents).decode('utf-8')
    mime_type = file.content_type
    image_url = f"data:{mime_type};base64,{encoded}"
    
    
    parser = PydanticOutputParser(pydantic_object=PhotoUploadInfo)
    messages = [SystemMessage(
        content=[
            {"type": "text",
            "text": "You are being used in a mobile app that handles tracking the users comic collection, return the necessary data for it to be added"},
            {"type":"text",
            "text": "Now since successfully adding to mongodb take specificity, when returning the title and character name, be sure the grammar matches the title and charcatrs name in the users mongodb collection if it exists, otherwise it will be added under a new character and/or title section. For example Spider-Man is normally typed as Spider-man but if in the necessary info about the users collection, it is 'Spiderman you make the character Spiderman'"},
            {"type": "text",
            "text": f"in json format give me the info like this: {parser.get_format_instructions()}"}
        ]
        ), HumanMessage(
            content=[
                {"type": "image_url", "image_url": image_url},
            ],
    )]
    
    formatted_results = google_search_with_filter(messages, PhotoUploadInfo)
    issue_rundown_draft = formatted_results.model_dump()
    not_issue_rundown_keys = ["character", "title_type", "title", "vol", "issue_number"]

    for i in not_issue_rundown_keys:
        del issue_rundown_draft[i]
    
    issue_rundown = format_comic_details(issue_rundown_draft)            
    character, title = get_char_and_title(formatted_results, token, production_collection)
    
    production_collection.update_one(
        {"tokens": token}, 
        {"$set": 
            {f"characters.{character}.{formatted_results.title_type}.{title}.vol {formatted_results.vol}.{formatted_results.issue_number}.issueRundown": issue_rundown}
        }
    )
    
    await publish(token)
    
    
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)