import { useState, useEffect, useRef } from "react";
import { routesMap } from "../../routes";
import useVisibility from "./visibility";


export default function useCharList(){
    const token = localStorage.getItem("comicManagementToken");
    const [ characters, setCharacters ] = useState("")
    const ws = useRef(null)
    console.log(routesMap.wsLink);
    
    
    
    function loadChars(){
        ws.current = new WebSocket(routesMap.wsLink)
        ws.current.onopen = () =>{
                ws.current.send(token);
                console.log("sent token");
                
        }
            
        ws.current.onmessage = (event) =>{
            console.log("here");
            
            const data = JSON.parse(event.data);
            console.log(data);
            setCharacters(data);            
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