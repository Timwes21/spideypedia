import { useState } from "react";
import IssueDetails from "./issue-details.jsx";
import { DeleteIssue } from "./update-comic-list/delete-issue.jsx";

export default function Issues({character, type, titleName, vol, issues, visible}){
    const [ issueDetailsVisibility, setIssueDetailsVisibility ] = useState({})
    const [ isKeyIssue, setKeyIssue ] = useState(false)

    function setKeyIssues( name, issueNumber){
        const normalIssue = (
                <span className="char-header" onClick={()=>toggleVisibility(issueNumber)}>{issueNumber}: {name}</span>
        )

        const keyIssue = (
                <strong className="char-header" onClick={()=>toggleVisibility(issueNumber)}>{issueNumber}: {name}</strong>
        )
        return isKeyIssue?keyIssue:normalIssue
    }

    const toggleVisibility=(index)=>{
        setIssueDetailsVisibility((prev)=>({
            ...prev,
            [index]: !prev[index] 
        }))
    }
    
    
    return visible?(
        <div className="issues">
            {Object.entries(issues).map(([issueNumber, issueDetails])=>(
                <div key={issueNumber} className="issues">
                    {setKeyIssues(issueDetails.issueRundown.Name, issueNumber)}
                    <IssueDetails character={character} type={type} titleName={titleName} vol={vol} issueNumber={issueNumber} issueDetails={issueDetails} visible={issueDetailsVisibility[issueNumber]}/>
                    <DeleteIssue character={character} type={type} titleName={titleName} vol={vol} issueNumber={issueNumber}/>
                    <hr/>
                </div>
            ))}
        </div>
    ): <></>
}