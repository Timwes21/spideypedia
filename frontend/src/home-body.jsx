import Collection from "./components/collection.jsx"
import Agent from "./components/ai-agent.jsx"
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