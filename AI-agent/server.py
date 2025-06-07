from fastapi import Request, FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from graph import router_workflow
from db import production_collection
import time
from redis_pub import publish
import base64
from google.ai.generativelanguage_v1beta.types import Tool as GenAITool  
from langchain_core.messages import HumanMessage, SystemMessage
from llm import llm
from models import comicBookDbTemplate, PhotoUploadInfo
from langchain.output_parsers import PydanticOutputParser



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
            chat += [{"role": "user", "content": user_input}]
            await ws.send_json({"loading": "forming response"})
            state = await router_workflow.ainvoke({"input": user_input, "token": token, "collection": production_collection, "chat": chat})
            output = state['output']
            chat += [{"role": "assistant", "content": output}]
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
    characters: dict = production_collection.find_one({"tokens": token}, {"characters": 1, "_id": 0})
    characters = characters['characters']
    new_dict = {}    
    
    for character_name, character_contents in characters.items():
        if character_name not in new_dict:
            new_dict[character_name] = {}
        for title_type, titles in character_contents.items():
            if title_type not in new_dict[character_name]:
                new_dict[character_name][title_type] = {}
            for title_name, n in titles.items(): 
                new_dict[character_name][title_type][title_name]={}

            
    parser = PydanticOutputParser(pydantic_object=PhotoUploadInfo)
    
    system_message = SystemMessage(
        content=[
            {"type": "text",
            "text": f"You are being used in a mobile app that handles tracking the users comic collection. The collection is stored in mondodb with this strutcure: {comicBookDbTemplate}, and this is the necessary details of the users current collection: {new_dict}"},
            {"type": "text",
            "text": f"in json format give me the info like this: {parser.get_format_instructions()}"}
            
        ]
    )
    
    
    message = HumanMessage(
        content=[
            {"type": "image_url", "image_url": image_url},
        ],
    )
    
    result = llm.invoke([system_message, message], tools=[GenAITool(google_search={})])
    
    
    formatted_results = parser.parse(result.content)

    
    print(formatted_results)
    
        
        
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)