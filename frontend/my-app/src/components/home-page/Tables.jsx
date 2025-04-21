import Collection from "./collection"
import Agent from "./ai-agent.jsx"
import LogoutButton from "./logout-button.jsx"
import { useState } from "react"
import { submitToAgentApi } from'./routes.jsx'
export default function Tables(){
    const [ input, setInput ] = useState("");
    const [ agentReply, setAgentReply ] = useState("");
    const [ refresh, setRefresh ] = useState(false)
    
    function submit(){
        input && fetch(submitToAgentApi, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: localStorage.getItem("comicManagementToken"), input: input})
        })
        .then(response=>response.json())
        .then(data=>{
            setAgentReply(data.message);
            setRefresh(true)
        })
        .catch(err=> console.log(err))
    }
    
    return(
        <>
            <div className="tables">            
                <Collection refresh={refresh}/>
                <LogoutButton/>
                <Agent/>
            </div>
        </>
            
    )
}