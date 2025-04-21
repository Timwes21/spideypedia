import { useState } from "react";
import IssueDetails from "./issue-details.jsx";

export default function Issues({issues, visible}){
    const [ issueDetailsVisibility, setIssueDetailsVisibility ] = useState({})
    const [isKeyIssue, setKeyIssue ] = useState(false)

    function setKeyIssues(issueDetails, name, issueNumber){
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
    
    console.log("issues", issues);
    
    return visible?(
        <div className="issues">
            {Object.entries(issues).map(([issueNumber, issueDetails])=>(
                <div key={issueNumber} className="issues">
                    {setKeyIssues(issueDetails, issueDetails.name, issueNumber)}
                     
                    <IssueDetails issueDetails={issueDetails} visible={issueDetailsVisibility[issueNumber]}/>
                    <hr />
                </div>
            ))}
        </div>
    ): <></>
}