import express from 'express';
import multer from 'multer';
import { withDecryptToken } from '../db/token-handler.js';


function comicsRouter(updateCollectionRouteHandler, publish, collection){
    const upload = multer({ dest: "uploads/" })
    const router = express.Router();
    router.post("/:key", upload.single("image"), withDecryptToken, async(req, res)=>{
        const data = req.body;
        const { key } = req.params;
        try{
            data.path = req.file?.path || null;
            await updateCollectionRouteHandler[key](data, collection);
            await publish(data.token);
            res.status(200).json({message: "Character Added"});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: "Something went wrong, try again later"});
        }
    })


    return router;
}

export default comicsRouter