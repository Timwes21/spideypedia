import { useState } from 'react'
import Issues from './issues.jsx'
import AddIssue from './update-comic-list/add-issue.jsx'

export default function Volumes({volumes, visible, titleName, type, character}){
    const [issuesVisibility, setIssuesVisibility] = useState({})
    

    const toggleTitleVisibility=(year)=>{
        setIssuesVisibility((prev)=>({
            ...prev,
            [year]: !prev[year]
        }))
    }

    
    return visible?(
        <div className="volumes">
            {Object.entries(volumes).map(([vol, issues])=>
            <>
                <strong className="char-header" id='vol' onClick={()=>toggleTitleVisibility(vol)} key={vol}>{vol}</strong>
                <AddIssue vol={vol} titleName={titleName} type={type} character={character}/> 
                <Issues issues={issues} character={character} type={type} titleName={titleName} vol={vol} visible={issuesVisibility[vol]}/>
            </>
            )}
        </div> 
    ): <></>
}