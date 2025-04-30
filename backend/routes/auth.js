import express from 'express';


function authRouter(createUser, authorizeUser, authorizeUsername, collection){
    const router = express.Router()

    async function checkIfUserExists(req, res, next){
        const username = req.body.username;
        const result = await authorizeUsername(username, collection);
        console.log(result);
    
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
        console.log(args);
        const token = await authorizeUser(...args, collection);
        console.log("token", token);
        
        res.status(200).json({message: "logged in", token: token})
    }
    catch(err){
        console.log(err);
        
        res.status(401).json({message: "No user found"});
    }
})

    return router;
}

export default authRouter