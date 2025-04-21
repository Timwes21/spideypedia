import { useState } from "react"
import Volumes from "./volumes.jsx"
import AddIssue from "./add/add-issue.jsx";

export default function Titles({ title, visible, type, character }){

    const [ issuesVisibility, setIssuesVisibility ] = useState({});


    const toggleVisibility = (titleName) =>{
        setIssuesVisibility((prev)=>({
            ...prev,
            [titleName]: !prev[titleName]
        }))
}

    return visible?(
        <div>
            {Object.entries(title).map(([titleName, volumes])=>(
                <div key={titleName} className="title">
                    <strong className="title-name" onClick={()=>toggleVisibility(titleName)}>{titleName}</strong> 
                    <Volumes volumes={volumes} titleName={titleName} type={type} character={character} visible={issuesVisibility[titleName]}/>                  
                </div>
            ))}
        </div>
    ):<></>
}