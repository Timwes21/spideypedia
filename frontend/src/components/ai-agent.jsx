import { useState, useEffect, useRef } from "react";
import { submitToAgentWs, routesMap } from'../../routes.js'



export default function Agent(){
    const [ input, setInput ] = useState("");
    const [ isOpen, setIsOpen ] = useState(false);
    const [ reply, setReply ] = useState("");
    const [ wsClosed, setWsClosed ] = useState(true);
    const [ refreshWs, setRefreshWs ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const ws = useRef(null);


    useEffect(()=>{
        ws.current = new WebSocket(submitToAgentWs, ["json", localStorage.getItem("comicManagementToken")]);
        ws.current.onopen  = () =>{
            console.log("ai assistant ready");
            setWsClosed(false)
        }
        ws.current.onerror = (err) => {
            console.log(err);
        }
        ws.current.onmessage = (event) =>{
            console.log(typeof event.data);
            
            const data = JSON.parse(event.data);
            console.log(data);
            setReply(data.AI);
        }

        ws.current.onclose = () => {
            setWsClosed(true);
        }

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };

    }, [refreshWs])


    const send = async() =>{
        if (wsClosed){
            setRefreshWs(!refreshWs);
        }
        await (!wsClosed && Promise.resolve())
        ws.current.send(JSON.stringify({
            input: input,
        }));
        setInput("");
    }

    const undo = () => {
        fetch(routesMap.undoRoute, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: localStorage.getItem("comicManagementToken")})
        })
    }


    return(
        <>
            <button className={isOpen?"chat-button close": "chat-button"} onClick={()=>setIsOpen(!isOpen)}>Command Line</button>
            <div className={isOpen? "agent-chat open": "agent-chat"}>

                <div className="command-header">
                    <span>AI COMMAND LINE</span>
                    <button className="close-chat-button" onClick={()=>setIsOpen(!isOpen)}>Close</button>
                </div>
                <div className="command-input">
                    <p style={{color: "white"}}>Add, Remove, or check if an issue exists</p>
                    <input value={input} onChange={(e)=>setInput(e.target.value)} type="text" />
                </div>
                <div className="command-buttons">
                    <button onClick={undo}>Undo</button>
                    <button onClick={send}>Send</button>
                </div>
                <div className="command-output">
                    {reply}
                </div>
                
            </div>
        </>
    )
}