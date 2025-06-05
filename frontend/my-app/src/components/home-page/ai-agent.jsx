import { useState, useEffect, useRef } from "react";
import { submitToAgentWs } from'../../routes.jsx'


export default function Agent(){
    const [ input, setInput ] = useState("");
    const [ agentReply, setAgentReply ] = useState("");
    const [ isOpen, setIsOpen ] = useState(false);
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
            addAgentReply(event.data)
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
            console.log(className);
            return <span className={className}>{value}</span>
        })
    }

    function addAgentReply(message){
        setMessages(prev=>[...prev, {"agent": message}])
    }

    const send = () =>{
        ws.current.send(JSON.stringify({
                token: localStorage.getItem("comicManagementToken"),
                input: input
            }));
        setMessages(prev=>[...prev, {"user": input}]);
        setInput("");
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
                </div>
                <div className="user-reply">
                    <input value={input} onChange={(e)=>setInput(e.target.value)} type="text" />
                    <button onClick={send}>Send</button>
                </div>
            </div>
        </>
    )
}