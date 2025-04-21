import { useState } from "react";
import { submitToAgentApi } from'./routes.jsx'


export default function Agent(){
    const [ input, setInput ] = useState("");
    const [ agentReply, setAgentReply ] = useState("");

    function submit(){
        input && fetch(submitToAgentApi, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: localStorage.getItem("comicManagementToken"), input: input})
        })
        .then(response=>response.json())
        .then(data=>{
            setAgentReply(data.message);
        })
        .catch(err=> console.log(err))
    }


    return(
        <div className="table" id="agent-table">
            <h1 className="table-header">Agent</h1>
            <div className="table-contents">
                <textarea value={input} onChange={(e)=>setInput(e.target.value)} className="user-input" name="" id=""></textarea>
                <button onClick={submit}>Submit</button>
                <div className="agent-reply">{agentReply}</div>
            </div>
        </div>
    )
}