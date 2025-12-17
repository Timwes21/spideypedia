import Titles from "./titles.jsx"
import useVisibility from "../../hooks/visibility.jsx";

export default function CharContents({ charData, visible, character }){
    const [ visibility, toggleVisibility ] = useVisibility();

    




    return visible?(
        <ul className="char-contents"> 
        {Object.entries(charData).map(([type, title]) => (
            <li key={type}>
                <strong className="title-type" onClick={()=>toggleVisibility(type)}>{type}:</strong>  
                <Titles title={title} visible={visibility[type]} type={type} character={character}/>
            </li>
            ))}
        </ul>
    ): <></>
}