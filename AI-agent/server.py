from fastapi import Request, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from graph import router_workflow
from db import production_collection
import time

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
            print(data)
            start = data['start']
            token = data['token']
            user_input = data['input']
            chat = get_chat(token, start)
            chat += [{"role": "user", "content": user_input}]
            state = await router_workflow.ainvoke({"input": user_input, "token": token, "collection": production_collection, "chat": chat})
            output = state['output']
            chat += [{"role": "assistant", "content": output}]
            chats[token] = chat
            await ws.send_json({"output": output, "start": state['start']})
            
    except WebSocketDisconnect as e:
        print(e)
        
        
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)