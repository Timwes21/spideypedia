import { useState } from "react";
import { comicsBase } from "../routes.jsx";


export default function IssueDetails({character, type, titleName, vol, issueNumber, issueDetails, visible}){
    const token = localStorage.getItem("comicManagementToken");

    const [edit, setEdit] = useState(false);
    const [issueDetailList, setIssueDetailList ] = useState({
        ...issueDetails.issueRundown
    })
    const [ issueDetailsKeys, setIssueDetailsKeys ] = useState(Object.keys(issueDetailList))
    const [ issueDetailsValues, setIssueDetailsValues ] = useState(Object.values(issueDetailList))
    const [ imageFile, setImageFile ] = useState()
    const [ image, setImage ] = useState(comicsBase + `/images/${token}/${character}/${type}/${titleName}/${vol}/${issueNumber}`)

    
    const save = () => {
        const issueDetailsKeysCopy = [...issueDetailsKeys]
        const combine = Object.fromEntries((issueDetailsKeysCopy).map((key, index)=>[key, issueDetailsValues[index]]))
        setEdit(!edit);
        setIssueDetailList({...combine})
        const formData = new FormData();
        formData.append('token', localStorage.getItem("comicManagementToken"));
        formData.append('path', `${character}/${type}/${titleName}/${vol}/${issueNumber}`)
        formData.append('characterData', JSON.stringify({
            character: character, 
            type: type, 
            titleName: 
            titleName, 
            vol: vol, 
            issueNumber: issueNumber
        }));
        formData.append("image", imageFile);
        formData.append("issueDetailList", JSON.stringify({...combine}))
        fetch(comicsBase + "/update-details", {
            method: "POST",
            body: formData
            })
        
        
    }

    const cancel = () => {
        setIssueDetailsKeys(Object.keys(issueDetailList))
        setIssueDetailsValues(Object.values(issueDetailList))
        setEdit(!edit)
    }
            
    function renderButtons(){
        return !edit?(<button className="edit-buttons" onClick={()=>setEdit(!edit)}>edit</button>): 
                    (<>
                        <button onClick={save} className="edit-buttons">save</button> 
                        <button onClick={cancel} className="edit-buttons">cancel</button>
                        <button className="edit-buttons" onClick={()=>{
                            setIssueDetailsKeys(prev=>{
                                const index = prev.length;
                                const updated = [...prev];
                                updated[index]=""
                                return updated;
                            })
                            setIssueDetailsValues(prev=>{
                                const index = prev.length;
                                const updated = [...prev];
                                updated[index]=""
                                return updated;
                            })
                        }}>add field</button>
                </>)
    }

    function renderDetails(){
        if (edit){
            const newDetails = issueDetailsKeys.map((key, keyIndex)=>{              
            return (<span key={keyIndex} >
                        <input className="detail-input" type="text" value={issueDetailsKeys[keyIndex]} onChange={e=>{
                            setIssueDetailsKeys(prev=>{
                                const updated = [...prev];
                                updated[keyIndex] = e.target.value;
                                return updated;
                            })
                        }}/>: 
                        <input className="detail-input" type="text" value={issueDetailsValues[keyIndex]} onChange={e=>{
                            setIssueDetailsValues(prev=>{
                                const updated = [...prev];
                                updated[keyIndex] = e.target.value;
                                return updated;
                            })
                        }}/>
                        <button className="delete-issue-button" onClick={()=>{
                            setIssueDetailsValues(prev=>prev.filter((_, i)=>i !== keyIndex));
                            setIssueDetailsKeys(prev=>prev.filter((_, i)=>i !== keyIndex));
                        }}>Delete</button>
                    </span>)})
                return newDetails;
            
            }

        return Object.entries(issueDetailList).map(([label, detail])=>{
            return (<span key={label}><strong>{label}: </strong>{detail}</span>)})
    }
    
    
    
    
    
    
    function renderImage(){
        if (edit){
            return (<>
                <img src={image} className="issue-image" alt="comic-cover" />
                <label id="add-image-label" className="make-smaller" htmlFor="image-input-details">Add New Photo</label>
                <input id="image-input-details" type="file" accept="image/*" onChange={(e)=>{
                    setImageFile(e.target.files[0]);
                    console.log(imageFile);
                    setImage(URL.createObjectURL(e.target.files[0]));}}/>
                </>)
        }
        return (<img src={image} className="issue-image" alt="comic-cover" />)
    }
    
    function renderIssueDetails(){
        return (<div className="issue-details">
                    <div className="issue-image-container">
                        {renderImage()}
                    </div>
                    <div className="issue-rundown">
                        {renderDetails()}
                    </div>
                    {renderButtons()}
                </div>)
    }
    
    return visible? renderIssueDetails(): <></>;

}