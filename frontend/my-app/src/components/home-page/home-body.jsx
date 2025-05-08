import Collection from "./collection.jsx"
import Agent from "./ai-agent.jsx"
import { useState } from "react"
export default function HomeBody(){
    const [ refresh, setRefresh ] = useState(false)
    
    return(
        <>
            <div className="tables">            
                <Collection refresh={refresh}/>
                <Agent/>
            </div>
        </>
            
    )
}