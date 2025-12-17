from fastapi import Request, FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, Form, Response
from fastapi.websockets import WebSocketState
from fastapi.middleware.cors import CORSMiddleware
from Graphs.ChatGraph.graph import graph
from Graphs.ChatGraph.actions import add_comics
from utils.redis_pub import publish
from utils.helper_functions import google_search_with_filter
import base64
import asyncio
import json
import secrets
from langchain_core.messages import HumanMessage, SystemMessage
from utils.schemas import UpdateComics, ComicDetails
from langchain.output_parsers import PydanticOutputParser
from utils.helper_functions import format_comic_details, get_char_and_title, google_search_with_filter, get_comic_info
from utils.lifespan import lifespan
from pathlib import Path
from utils.minio_client import client
import os

picture_path = os.getenv("image_path", "images")

app = FastAPI(lifespan=lifespan)

PATH = Path(picture_path)


bucket_name = os.getenv("BUCKET_NAME", "python-test-bucket")


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


def get_picture_path(issue_details: UpdateComics, token: str, image: UploadFile):
    comic_path = f"{issue_details["character"]}/{issue_details["title_type"]}/{issue_details["title"]}/{issue_details["vol"]}/{issue_details["issue_number"]}"
    picture_path = PATH/token/comic_path
    picture_path.mkdir(parents=True, exist_ok=True)
    return picture_path/Path(image.filename)


@app.websocket("/ws")
async def talk_to_agent(ws: WebSocket):
    token_proto = ws.headers.get("sec-websocket-protocol", "")
    if not token_proto:
        print("Websocket closing due to no token")
        await ws.close(reason="token is not there")
        return
    token = token_proto.split(", ")[1]
    await ws.accept(subprotocol="json")
    
    while True:
        try:
            data = await ws.receive_text()
            state = await graph.ainvoke(
                {
                    "input": data,
                    "token": token,
                    "collection": ws.app.state.collection,
                }
            )
            ai_message = {"AI": state['output']}
            await ws.send_json(ai_message)
            print("send something")
        except WebSocketDisconnect as e:
            print("ws disconected: ", e)
            break
        except Exception as e:
            print("error: ", e)
            if ws.client_state == WebSocketState.CONNECTED:
                await ws.send_json({"AI": "error"})


            

        
@app.post("/undo")
async def undo_recent(req: Request):
    collection = req.app.state.collection
    data = await req.json()
    token = data["token"]
    restored_state = await collection.find_one({"tokens": token}, {"previous characters": 1, "_id": 0})
    await collection.update_one({"tokens": token}, {"$set": {"characters": restored_state["previous characters"]["characters"]}})
    await publish(token)
    
@app.post("/add-by-photo")
async def add_by_photo(req: Request, file: UploadFile = File(...), token = Form(...)):
    collection = req.app.state.collection
    contents = await file.read()
    encoded = base64.b64encode(contents).decode('utf-8')
    mime_type = file.content_type
    image_url = f"data:{mime_type};base64,{encoded}"
    
    
    parser = PydanticOutputParser(pydantic_object=ComicDetails)
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
    
    formatted_results: ComicDetails = await google_search_with_filter(messages, filter=ComicDetails)
    issue_rundown_draft = formatted_results.model_dump()
    
    issue_rundown = format_comic_details(issue_rundown_draft)            
    character, title = await get_char_and_title(formatted_results, token, collection)
    
    await collection.update_one(
        {"tokens": token}, 
        {"$set":
            {f"characters.{character}.{formatted_results.title_type}.{title}.vol {formatted_results.vol}.{formatted_results.issue_number}.issueRundown": issue_rundown}
        }
    )
    
    await publish(token)



@app.post("/add-issue")
async def get_comic_details(req: Request, issue_details = Form(...), image: UploadFile | None = File(None)):
    collection = req.app.state.collection
    token = req.headers['token']
    issue_details = json.loads(issue_details)
    print(type(image))
    print(image)


    task = f"add the {issue_details["title_type"]}, {issue_details["title"]} vol {issue_details["vol"]}, issue {issue_details["issue_number"]}"
    await add_comics(task, {"collection": collection, "token": token}, image)
    await publish(token)

        
@app.get("/get-issue-image/{image_path}")
async def get_issue_image(image_path: str):
    image_path = image_path.replace("~~", "/")
    obj = None
    try:
        get_obj_func = client.get_object
        get_obj_args = [bucket_name, image_path]
        
        obj = await asyncio.to_thread(get_obj_func, *get_obj_args)

        fetched_data = await asyncio.to_thread(obj.read)
        stat = await asyncio.to_thread(client.stat_object, bucket_name, image_path)
        content_type = getattr(stat, "content_type", "application/octet-stream")
        content_type = "application/octet-stream"
        return Response(content=fetched_data, media_type=content_type)
    except Exception as e:
        print(e)
    finally:
        if obj:
            await asyncio.to_thread(obj.close)
    



    
    

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)

