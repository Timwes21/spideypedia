import Volumes from "./volumes.jsx"
import useVisibility from "../../../hooks/visibility.jsx";
import AddVol from "./update-comic-list/add-vol.jsx";

export default function Titles({ title, visible, type, character }){
    const [issuesVisibility, toggleVisibility] = useVisibility()

    

    return visible?(
        <div>
            {Object.entries(title).map(([titleName, volumes])=>(
                <div key={titleName} className="title">
                    <strong className="title-name" onClick={()=>toggleVisibility(titleName)}>{titleName}</strong> 
                    <AddVol title={titleName} type={type} character={character}/>
                    <Volumes volumes={volumes} titleName={titleName} type={type} character={character} visible={issuesVisibility[titleName]}/>                  
                </div>
            ))}
        </div>
    ):<></>
}