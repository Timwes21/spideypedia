import { useState } from "react";
import { routesMap } from "../../../../routes";
// import { comicsBase } from "./";

export default function AddChar(){

    const [ character, setCharacter ] = useState("")
    const [ visible, setVisible ] = useState(false)
    const token = localStorage.getItem("comicManagementToken");
    
    function addCharacter(){
        console.log("character");
        console.log(token);
        console.log(addCharacterApi);
        
        console.log(character);
        console.log("inbetween");
        
        setVisible(!visible)
        setCharacter("");
        character && fetch(routesMap.addChar, {
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