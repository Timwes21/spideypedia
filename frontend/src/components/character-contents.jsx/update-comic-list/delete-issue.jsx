import { useState } from "react";
import { routesMap } from "../../../../routes.js"

export function DeleteIssue({character, type, titleName, vol, issueNumber}){
    const [confirm, setConfirm] = useState(false)

    const deleteIssue =() => {
        // console.log("char: delete", localStorage.getItem("comicManagementToken"));
        
        fetch(routesMap.deleteIssue, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: localStorage.getItem("comicManagementToken"), 
                characterData:{
                    character,
                    type,
                    titleName,
                    vol,
                    issueNumber
                } 
            })
        })
        .then(()=>{
            setConfirm(!confirm)
        })
        .catch(err=>console.log(err))
    }

    const deleteButton = <button onClick={()=>setConfirm(!confirm)} className="delete-issue-button">Delete</button>
    
    const confirmButtons = 
        (<>
            <button className="delete-issue-button" onClick={deleteIssue}>yes</button>
            <button className="delete-issue-button" onClick={()=>setConfirm(!confirm)}>no</button>
        </>)
     
    return confirm? confirmButtons: deleteButton
}