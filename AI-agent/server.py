from fastapi import Request, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from graph import router_workflow
from db import production_collection

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

@app.websocket("/ws")
async def talk_to_agent(ws: WebSocket):
    await ws.accept()
    try: 
        while True:
            data = await ws.receive_json()
            print(data)
            state = await router_workflow.ainvoke({"input": data["input"], "token": data["token"], "collection": production_collection})
            await ws.send_text(state["output"])
            
    except WebSocketDisconnect as e:
        print(e)
        
        
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)