import { useState } from "react";
import { comicsBase } from "../../../../../routes";


export default function AddVol({ character, type, title}){
    const [ vol, setVol ] = useState("");
    const [ visible, setVisible ] = useState(false);
    console.log(title);
    
    const addButton = <button className="make-smaller" onClick={()=>setVisible(!visible)}>Add Volume</button>         


    const add = () => {
        vol && fetch(comicsBase + "/add-vol", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                token: localStorage.getItem("comicManagementToken"), 
                characterData: {
                    character, 
                    type, 
                    title,
                    vol :vol 
                } 
            })
        })
        .then(()=>{
          clearForm()
        })
        .catch(err=>console.log(err))
    }


    const clearForm = () => {
        setVol("");
        setVisible(false);
    }



    const addVolForm = (
        <div className="add-issue">
            <span className="label">Vol</span>
            <input type="text" className="add-input" value={vol} onChange={(e)=>setVol(e.target.value)} name="" id="" />
            <div className="buttons-add-issue">

            <button onClick={add}>Submit</button>
            <button onClick={clearForm}>Cancel</button>
            </div>

        </div>
    )

    return visible? addVolForm: addButton;
    
}