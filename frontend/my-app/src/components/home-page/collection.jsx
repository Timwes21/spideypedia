import { useState } from "react";
import AddChar from "./character-contents.jsx/add/add-char.jsx";
import CharList from "./character-contents.jsx/char-list.jsx";



export default function Collection({ refresh }){
    
    const [ visible, setVisible ] = useState(false);
    
    
    return(
        <div className="table" id="collection-table">
            <h1 className="table-header">Comics</h1>
            <div className="table-contents">
                <div className="character-list">
                    <CharList refresh={refresh}/>
                </div>
                <AddChar visible={visible}/>
            </div>
        </div>
    )
}