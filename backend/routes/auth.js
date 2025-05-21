import express from 'express';


function authRouter(createUser, authorizeUser, authorizeUsername, forgetUserToken, collection){
    const router = express.Router()

    async function checkIfUserExists(req, res, next){
        const username = req.body.username;
        const result = await authorizeUsername(username, collection);
    
        if (result){
            console.log('here');
            return next(); 
        }
        res.status(401).json({message: "username already exists"});
    }



    router.post("/create-user", checkIfUserExists, async(req, res)=>{
        const data = req.body;
        console.log('in creation');
        
    try{
        const token = await createUser(data, collection);
        res.status(200).json({token: token});
    }
    catch(err){
        res.status(500).send({err: err});
        console.log(err);
    }
})

router.post("/login", async(req, res)=>{
    const data = req.body;
    console.log('in login');
    
    try{
        const args = Object.values(data);
        const token = await authorizeUser(...args, collection);
        res.status(200).json({message: "logged in", token: token})
    }
    catch(err){
        console.log(err);
        
        res.status(401).json({message: "No user found"});
    }
})

router.post("/logout", async(req, res)=>{
    const data = req.body;
    try{
        await forgetUserToken(data, collection);
        res.status(200).json({message: "token deleted"})
    }
    catch(err){
        res.status(500).json({message: err});
    }
})

    return router;
}

export default authRouter