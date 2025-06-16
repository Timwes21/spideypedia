import { useState } from "react"
import { comicsBase } from "./../../../../../routes.js";

const addTitleApi = comicsBase + "/add-title";
export default function AddTitle({ character }){
    const [ type, setType ] = useState();
    const [ name, setName ] = useState();
    const [ vol, setVol] = useState();
    const [ buttonPressed, setButtonPressed ] = useState(false);
    
    
    console.log(type);

    function clearForm(){
        setButtonPressed(false);
        setType("");
        setName("");
        setVol("")
    }
    
    const addButton=()=>{
        (type && name && vol) && fetch(addTitleApi, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                token: localStorage.getItem("comicManagementToken"), 
                characterData:{    
                    character, 
                    type: type, 
                    name: name, 
                    vol: vol
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
            <span className="label">Vol</span>
            <input type="text" value={vol} onChange={(e)=>setVol(e.target.value)} name="" id="" />
            <div className="buttons-add-title">

            <button onClick={addButton}>Submit</button>
            <button onClick={clearForm}>Cancel</button>
            </div>

        </div>
    ): <button className="make-smaller" onClick={()=>setButtonPressed(!buttonPressed)}>Add Title</button>         
}