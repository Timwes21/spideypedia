import Titles from "./titles.jsx"
import { useState } from "react"

export default function CharContents({ charData, visible, character }){
    const [ titlesVisibility, setTitlesVisibility ] = useState({})


    const toggleVisibility=(type)=>{
        setTitlesVisibility((prev)=>({
            ...prev,
            [type]: !prev[type]
        }))
    }


    return visible?(
        <ul className="char-contents"> 
        {Object.entries(charData).map(([type, title]) => (
            <li key={type}>
                <strong className="title-type" onClick={()=>toggleVisibility(type)}>{type}:</strong>  
                <Titles title={title} visible={titlesVisibility[type]} type={type} character={character}/>
            </li>
            ))}
        </ul>
    ): <></>
}