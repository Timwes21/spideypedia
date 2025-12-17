import { useState } from "react"
import { routesMap } from "../../../../routes.js";

export default function AddTitle({ character }){
    const [ type, setType ] = useState();
    const [ name, setName ] = useState();
    const [ buttonPressed, setButtonPressed ] = useState(false);
    

    function clearForm(){
        setButtonPressed(false);
        setType("");
        setName("");
    }
    
    const addButton=()=>{
        (type && name) && fetch(routesMap.addTitle, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                token: localStorage.getItem("comicManagementToken"), 
                characterData:{    
                    character, 
                    type: type, 
                    titleName: name, 
                } 
            })
        })
        .then(()=>{
          clearForm();
        })
        .catch(err=>console.log(err))
    }

    

    return buttonPressed? (
        <div className="add-title">
            <select name="" value={type} onChange={(e)=>setType(e.target.value)} id="">
                <option value=""></option>
                <option value="Series">Series</option>
                <option value="Mini-Series">Mini-Series</option>
                <option value="One-Shot">One-Shot</option>
            </select>
            <span className="label">Name</span>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} name="" id="" />
            <div className="buttons-add-title">

            <button onClick={addButton}>Submit</button>
            <button onClick={clearForm}>Cancel</button>
            </div>

        </div>
    ): <button className="make-smaller" onClick={()=>setButtonPressed(!buttonPressed)}>Add Title</button>         
}