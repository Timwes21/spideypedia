import { useState } from "react";
import { comicsBase } from "../../../../routes";

const addRouteApi = comicsBase + "/add-issue"
export default function AddIssue({titleName, type, character, vol}){
    const [ issueNumber, setIssueNumber ] = useState();
    const [ buttonPressed, setButtonPressed ] = useState();
    const [ imageFile, setImageFile ] = useState();
    const [ preview, setPreview ] = useState()

    function add(){
        if (issueNumber) {
        const formData = new FormData();
        formData.append('token', localStorage.getItem("comicManagementToken"));
        formData.append('path', `${character}/${type}/${titleName}/${vol}/${issueNumber}`);
        formData.append('issueDetails', JSON.stringify({
            character: character,
            type: type,
            titleName: titleName,
            vol: vol,
            issueNumber: issueNumber
        }));
        formData.append("image", imageFile);

            fetch(addRouteApi, {
                method: "POST",
                body: formData
                
            })
            .then(response=>response.json())
            .then(()=>{
                setButtonPressed(!buttonPressed)
                setIssueNumber("")
                setPreview("")
            })
            .catch(err=>console.log(err))
        }
    }

    function cancel(){
        setButtonPressed(!buttonPressed);
        setImageFile("");
        setPreview("");
        setIssueNumber("");

    }

    

    const button = (
        <button className="make-smaller" onClick={()=>setButtonPressed(true)}>Add Issue</button>
    )
    const addForm = (
    <div id="add-issue">
        <strong className="label">Issue: </strong>
        <input type="text" value={issueNumber} onChange={(e)=>setIssueNumber(e.target.value)} className="input" name="" id="add-issue-input" />
        <label htmlFor="image-input">Add Photo</label>
        <input id="image-input" type="file" accept="image/*" onChange={(e)=>{
            setImageFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
            }
        }/>
        {preview && <img alt="pic" src={preview} style={{ width: "60px" }}/>}
        <div className="buttons-add-issue">
            <button onClick={(e)=>{
                    e.preventDefault();
                    add();
                    cancel();
                }
            }>Add</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    </div>
    )

    return buttonPressed? addForm: button


}