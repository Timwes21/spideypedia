import express from 'express';



function agentRouter(redisPub, Agent){
    const router = express.Router()
    
    router.post("/convo", async(req, res)=>{
        const data = req.body;
        const { token, input } = data
        console.log('here');
        try{
            const agent = new Agent();
            const result = await agent.handleTask(token, input, redisPub);
            await redisPub.publish("charUpdates", data.token);
            await redisPub.expire("chat:session:" + data.token, 3600);  
            res.status(200).json({message: result});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: "error"})
        }
    })
    return router;
}

export default agentRouter;