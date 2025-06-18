import { useState, useEffect, useRef } from "react";
import { wsLink } from "../../routes";
import useVisibility from "./visibility";


export default function useCharList(){
    const token = localStorage.getItem("comicManagementToken");
    const [ characters, setCharacters ] = useState("")
    const ws = useRef(null)
    
    
    function loadChars(){
        ws.current = new WebSocket(wsLink)
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
        }
    }


    useEffect(()=> loadChars(), [])

    
    const [ visibility, toggleVisibility ] = useVisibility();
    // refresh && loadChars()
    return [ characters, visibility, toggleVisibility]

}