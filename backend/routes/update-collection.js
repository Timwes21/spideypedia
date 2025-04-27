import express from 'express';
import { getDummyPhoto, getPhoto } from '../images/image-file-handling.js';


function comicsRouter(addToCharacter, addCharacter, AddIssue, deleteIssue, updateDetails, redisPub, collection){

    const router = express.Router()
    router.post("/add-character", async(req, res)=>{
        const data = req.body;
        try{
            const args = Object.values(data);
            await addCharacter(...args, collection);
            await redisPub.publish("charUpdates", data.token);
            res.status(200).json({message: "Character Added"});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: "Something went wrong, try again later"});
        }
    })

    router.post("/add-title", async(req, res)=>{
        const data = req.body;
        try{
            const {token, characterData } = data;
            await addToCharacter(token, characterData, collection);
            await redisPub.publish("charUpdates", data.token);
            res.status(200).json({message: "Character Updated"});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: "Something went wrong, try again later"});
        }
    })


    router.post("/add-issue", upload.single("image"), async(req, res)=>{
        const data = req.body;
        try{
            await AddIssue(token, issueDetails, collection)
            await redisPub.publish("charUpdates", data.token);
            res.status(200).json({message: "Issue Added"})
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: "Something went wrong"})
        }
    })

    router.post("/delete-issue", async(req, res)=>{
        const data = req.body;
        try{
            const { token, characterData, collection } = data;
            await deleteIssue(token, characterData, collection);
            await redisPub.publish("charUpdates", data.token);
            
            res.status(200).json({message: "Issue Added"})
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: "Something went wrong"})
        }
    })

    router.post("/update-details", upload.single("image"), async(req, res)=>{
        const data = req.body;
        try{
            const {token, characterData, issueDetailList} = data
            await updateDetails(token, characterData, issueDetailList, collection);
            await redisPub.publish("charUpdates", data.token);
            res.status(200).json({message: "Updated Details"})
        }
        catch(err){
            console.log(err);
            
            res.status(500).json({message: "Something went wrong"})


        }
    })

    router.get("/images/:token/:char/:type/:series/:vol/:issueNumber", async(req, res)=>{
        const { token, char, type, series, vol, issueNumber } = req.params;
        try{
            const filePath = getPhoto(token, char, type, series, vol, issueNumber, collection)
            res.sendFile(filePath);
        }
        catch(err){
            console.log(err);
            const filePath = getDummyPhoto()
            res.sendFile(filePath);
        }
    })



    return router;
}

export default comicsRouter