import { useState, useEffect, useRef } from "react";
import { submitToAgentWs, undoRoute } from'../../../routes.js'



export default function Agent(){
    const [ input, setInput ] = useState("");
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false)
    const [messages, setMessages] = useState([
    ]);

    const ws = useRef(null);


    useEffect(()=>{
        ws.current = new WebSocket(submitToAgentWs);
        ws.current.onopen  = () =>{
            console.log("ai assistant ready");
        }
        ws.current.onerror = (err) => {
            console.log(err);
        }
        ws.current.onmessage = (event) =>{
            console.log(typeof event.data);
            
            const data = JSON.parse(event.data);
            data.loading && setMessages(prev=>[...prev, {"agent": data.loading}])
            localStorage.setItem("start", data.start)
            setMessages(prev=>[...prev, {"agent": data.output}])
            setIsLoading(false);
        }

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };

    }, [])




    

    function displayMessages(){
        return messages.map((message, index)=>{
            const [[key, value]] = Object.entries(message);
            const className = key + "-message" + (index === messages.length-1? " new-message":"");
            return <span className={className}>{value}</span>
        })
    }


    const send = () =>{
        ws.current.send(JSON.stringify({
                token: localStorage.getItem("comicManagementToken"),
                input: input,
                start: localStorage.getItem("start") | 0
            }));
        setMessages(prev=>[...prev, {"user": input}]);
        setInput("");
        setIsLoading(true);
    }

    const undo = () => {
        fetch(undoRoute, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: localStorage.getItem("comicManagementToken")})
        })
    }


    return(
        <>
            <button className={isOpen?"chat-button close": "chat-button"} onClick={()=>setIsOpen(!isOpen)}>Talk to Your Agent</button>
            <div className={isOpen? "agent-chat open": "agent-chat"}>
                <div className="chat-header">
                    <span>AGENT</span>
                    <button className="close-chat-button" onClick={()=>setIsOpen(!isOpen)}>Close</button>
                </div>
                <div className="messages">
                    {displayMessages()}
                    {isLoading &&<span id="loading-message">loading...</span>}
                </div>
                <div className="user-reply">
                    <button onClick={undo}>Undo</button>
                    <input value={input} onChange={(e)=>setInput(e.target.value)} type="text" />
                    <button onClick={send}>Send</button>
                </div>
            </div>
        </>
    )
}