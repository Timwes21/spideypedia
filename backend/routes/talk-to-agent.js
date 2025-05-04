import express from 'express';



function agentRouter(Agent, collection){
    const router = express.Router()
    
    router.post("/convo", async(req, res)=>{
        const data = req.body;
        const { token, input } = data
        try{
            const agent = new Agent();
            const result = await agent.execute(token, input, collection);
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