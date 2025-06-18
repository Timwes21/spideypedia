import CharContents from "./char-contents.jsx";
import AddTitle from "./update-comic-list/add-title.jsx";
import { DeleteChar } from "./update-comic-list/delete-char.jsx";
import AddChar from "./update-comic-list/add-char.jsx";
import useCharList from "../../../hooks/useCharList.jsx";



export default function CharList(){
    const [ characters, visibility, toggleVisibility ] = useCharList();

    

    return (        
        <div>
            {Object.entries(characters).map(([charName, charData]) => (
                <>
                    <div key={charName}>
                        <strong
                        className="char-name" 
                        onClick={()=>toggleVisibility(charName)}>
                            {charName}
                        </strong> 
                        <AddTitle character={charName}/>
                        <DeleteChar character={charName}/>
                        <CharContents charData={charData} visible={visibility[charName]} character={charName}/>
                    </div>
                <hr />
            </>

            ))}
            <AddChar/>
        </div>
    )
}