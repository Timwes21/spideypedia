import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage()


function comicsRouter(updateCollectionRouteHandler, publish, collection){
    const upload = multer({ storage })
    const router = express.Router();
    router.post("/:key", upload.single("image"), async(req, res)=>{
        const data = req.body;
        console.log(data);
        
        
        const { key } = req.params;
        try{
            console.log(data.token);
            
            data.path = req.file?.buffer || null;
            await updateCollectionRouteHandler[key](data, collection);
            await publish(data.token);
            res.status(200).json({message: "Character Added"});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: err});
        }
    })


    return router;
}

export default comicsRouter