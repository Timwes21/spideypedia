import IssueDetails from "./issue-details.jsx";
import { DeleteIssue } from "./update-comic-list/delete-issue.jsx";
import useVisibility from "../../hooks/visibility.jsx";

export default function Issues({character, type, titleName, vol, issues, visible}){
    const [visibility, toggleVisibility] = useVisibility()

    const presentedVar = (variable) =>  variable || "";
    
    
    return visible?(
        <div className="issues">
            {Object.entries(issues).map(([issueNumber, issueDetails])=>(
                <div key={issueNumber} className="issues">
                    <span className="char-header" onClick={()=>toggleVisibility(presentedVar(issueNumber))}>{presentedVar(issueNumber)}: {presentedVar(issueDetails.issueRundown.Name)}</span>
                    <IssueDetails character={character} type={type} titleName={titleName} vol={vol} issueNumber={issueNumber} issueDetails={issueDetails} visible={visibility[issueNumber]}/>
                    <DeleteIssue character={character} type={type} titleName={titleName} vol={vol} issueNumber={issueNumber}/>
                    <hr/>
                </div>
            ))}
        </div>
    ): <></>
}