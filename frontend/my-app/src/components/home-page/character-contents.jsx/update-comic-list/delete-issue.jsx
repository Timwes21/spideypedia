import { useState } from "react";
import { comicsBase } from "../../routes.jsx"
export function DeleteIssue({character, type, titleName, vol, issueNumber}){
    const [confirm, setConfirm] = useState(false)

    function deleteIssue(){
        console.log("char: delete", character);
        
        fetch(comicsBase + "/delete-issue", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: localStorage.getItem("comicManagementToken"), 
                characterData:{
                    character: character, 
                    type: type, 
                    titleName: titleName, 
                    vol: vol, 
                    issueNumber: issueNumber
                } 
                })
        })
        .then(()=>{
            setConfirm(!confirm)
        })
    }
     return confirm? (
        <>
            <button className="delete-issue-button" onClick={deleteIssue}>yes</button>
            <button className="delete-issue-button" onClick={()=>setConfirm(!confirm)}>no</button>
        </>
    ): (
        <button onClick={()=>setConfirm(!confirm)} className="delete-issue-button">Delete</button>
    )
}