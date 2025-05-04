import Collection from "./collection"
import Agent from "./ai-agent.jsx"
import LogoutButton from "./logout-button.jsx"
import { useState } from "react"
export default function Tables(){
    const [ refresh, setRefresh ] = useState(false)
    
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