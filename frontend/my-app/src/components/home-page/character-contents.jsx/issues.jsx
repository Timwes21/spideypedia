import { useState } from "react";
import IssueDetails from "./issue-details.jsx";
import { DeleteIssue } from "./update-comic-list/delete-issue.jsx";

export default function Issues({character, type, titleName, vol, issues, visible}){
    const [ issueDetailsVisibility, setIssueDetailsVisibility ] = useState({})


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
                    <span className="char-header" onClick={()=>toggleVisibility(issueNumber)}>{issueNumber}: {()=>issueDetails.Name?issueDetails.Name:""}</span>
                    <IssueDetails character={character} type={type} titleName={titleName} vol={vol} issueNumber={issueNumber} issueDetails={issueDetails} visible={issueDetailsVisibility[issueNumber]}/>
                    <DeleteIssue character={character} type={type} titleName={titleName} vol={vol} issueNumber={issueNumber}/>
                    <hr/>
                </div>
            ))}
        </div>
    ): <></>
}