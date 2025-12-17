import { useState } from "react";
import { routesMap } from "../../../../routes";

export default function DeleteVolume({character, type, titleName, vol, issues}){
    const [confirm, setConfirm] = useState(false)

    const deleteVolume = () => {
        // console.log("char: delete", localStorage.getItem("comicManagementToken"));
        const objToSend = {
            token: localStorage.getItem("comicManagementToken"), 
            characterData: {
                character,
                type,
                titleName,
                vol,
            }
        }
        
        fetch(routesMap.deleteVol, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(objToSend)
        })
        .then(()=>{
            setConfirm(!confirm);
        })
        .catch(err=>console.log(err))
    }

    const deleteButton = <button onClick={()=>setConfirm(!confirm)} className="delete-issue-button">Delete</button>
    
    const confirmButtons = 
        (<>
            <button className="delete-issue-button" onClick={deleteVolume}>yes</button>
            <button className="delete-issue-button" onClick={()=>setConfirm(!confirm)}>no</button>
        </>)
     
    return confirm? confirmButtons: deleteButton
}