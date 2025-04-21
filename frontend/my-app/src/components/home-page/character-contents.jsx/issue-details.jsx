import Modal from "react-modal";

export default function IssueDetails({issueDetails, visible}){
//                             name: "include name for the story, if there is more than one story in an issue inlcude both names seperated by a ;",
//                             description: "one sentence summary of each story in an issue",
//                             issue: "number",
//                             creators: {
//                                 artist: "",
//                                 writer: "",
//                                 editor: ""
//                             },
//                             keyIssueFlags: {
//                                 firstAppearancesOfMajorCharacter: "leave null if none",
//                                 DeathOfMajorCharacter: "leave null if none",
//                                 costumeChanges: "leave null if none",
//                                 majorStoryArcs: "leave null if none", 
//                                 crossovers: "leave null if none"
//                             },
//                             image: "leave null",
//                             publicationDate: "",
//                             publisher: "marvel/dc/ect."

    const { name, description, issue, creators, keyIssueFlags, image, publicationDate, publisher } = issueDetails;
    // const { artist, writer, editor } = creators;
    // const {firstAppearancesOfMajorCharacter, DeathOfMajorCharacter, majorStoryArcs, costumeChanges, crossovers} = keyIssueFlags;
    console.log("creators: ", creators);
    


    function renderImage(){
        if (image.buffer){

            const byteArray = new Uint8Array(image.buffer);
            const blob = new Blob([byteArray], {type: 'image/jpeg'});
            const imageUrl = URL.createObjectURL(blob)
            return (
                <img src={imageUrl} alt="comic-cover" />
            )  
        }
    }

    return visible?(
            <div className="issue-details">
                <div className="issue-image-container">
                    {renderImage()}
                </div>
                <div className="issue-rundown">
                    <span key={creators.artist}><strong>Artist:</strong>{creators.artist}</span>
                    <span key={creators.writer}><strong>Writer:</strong>{creators.writer}</span>
                    <span key={creators.editor}><strong>Editor:</strong>{creators.editor}</span>
                </div>
            </div>
    ):<></>
}