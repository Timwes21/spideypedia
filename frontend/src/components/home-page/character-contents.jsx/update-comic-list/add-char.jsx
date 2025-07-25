import { useState } from "react";
import { comicsBase } from "../../../../../routes.js";
// import { comicsBase } from "./";
const addCharacterApi = comicsBase + "/add-character"

export default function AddChar(){

    const [ character, setCharacter ] = useState("")
    const [ visible, setVisible ] = useState(false)
    const token = localStorage.getItem("comicManagementToken");
    
    function addCharacter(){
        console.log("character");
        console.log(token);
        
        console.log(character);
        console.log("inbetween");
        
        setVisible(!visible)
        setCharacter("");
        character && fetch(addCharacterApi, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: token, character: character})
        })
        .then(response=>response.json())
        .then(data=>console.log(data))
        .catch(err=>console.log(err))
    }

    const div =(
        <div className="add-char">
            <input type="text" value={character} onChange={(e)=>setCharacter(e.target.value)}/>
            <button onClick={addCharacter}>Add</button>
            <button onClick={()=> setVisible(!visible)}>Cancel</button>
        </div>
    )
    

    return visible? div: <button className="add-char" onClick={()=> setVisible(!visible)}>Add a Character</button>
}