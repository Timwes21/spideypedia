import express from 'express'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({storage: storage})


function comicsRouter(addToCharacter, addCharacter, AddIssue, redisPub){
    const router = express.Router()
    router.post("/add-character", async(req, res)=>{
        const data = req.body;
        try{
            const args = Object.values(data);
            await addCharacter(...args);
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
        console.log(data);
    
        try{
            const args = Object.values(data)
            await addToCharacter(...args);
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
            const args = Object.values(data)
            const imageFile = req.file;
    
            await AddIssue(...args, imageFile)
            await redisPub.publish("charUpdates", data.token);
            res.status(200).json({message: "Issue Added"})
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: "Something went wrong"})
        }
    })


    return router;
}

export default comicsRouter