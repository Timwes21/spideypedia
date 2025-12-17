import { useState } from "react"
import { routesMap } from "../../../../routes.js";

export function DeleteChar({character}){
    const deleteChar = () =>{
        fetch(routesMap.deleteChar, 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ token: localStorage.getItem("comicManagementToken"), character})
            })
            .then(setConfirm(!confirm))
    }

    const [confirm, setConfirm ] = useState(false);
    const deleteButton = <button onClick={()=>setConfirm(!confirm)} className="delete-char-button">Delete</button>;
    const confirmButtons = (
        <>
            <button className="delete-char-button" onClick={()=>setConfirm(!confirm)}>Cancel</button>
            <button onClick={deleteChar} className="delete-char-button">Yes</button>
        </>
    )
    return confirm? confirmButtons: deleteButton;
}