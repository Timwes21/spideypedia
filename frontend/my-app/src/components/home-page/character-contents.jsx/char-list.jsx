import { useState, useEffect, useRef } from "react"
import CharContents from "./char-contents.jsx";
import AddTitle from "./update-comic-list/add-title.jsx";
const token = localStorage.getItem("comicManagementToken")

export default function CharList({refresh}){
    const [ characters, setCharacters ] = useState("")
    const [ characterVisibility, setCharacterVisibility ] = useState({})
    const [ addTitleVisibility, setAddTitleVisibility ] = useState({})
    const ws = useRef(null)
    const toggleVisibility=(charName)=>{
        setCharacterVisibility((prev)=>({
            ...prev,
            [charName]: !prev[charName] 
        }))
    }

    
    
    function loadChars(){
        // ws.current = new WebSocket("wss://spideypedia-production.up.railway.app")
        ws.current = new WebSocket("ws://localhost:3000")

        ws.current.onopen = () =>{
                ws.current.send(JSON.stringify(token));
        }
            
        ws.current.onmessage = (event) =>{
            console.log(JSON.parse(event.data));
            const data = JSON.parse(event.data);
            setCharacters(data.message);            
        }
    
        ws.current.onerror = (error) =>{
            console.log(error);  
        }
        return () => {
            ws.current.close() 
            refresh = false
        }
    }


    useEffect(()=> loadChars(), [])

    // refresh && loadChars()

    

    return (        
        <div>
            {Object.entries(characters).map(([charName, charData]) => (
                <>
                    <div key={charName}>
                        <strong
                        key={charName} 
                        className="char-name" 
                        onClick={()=>toggleVisibility(charName)}>
                            {charName}
                        </strong> 
                        <AddTitle visible={addTitleVisibility[charName]} character={charName}/>
                        <CharContents charData={charData} visible={characterVisibility[charName]} character={charName}/>
                    </div>
                <hr />
            </>

            ))}
        </div>
    )
}