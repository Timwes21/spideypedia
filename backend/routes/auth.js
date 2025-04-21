import express from 'express';


function authRouter(createUser, authorizeUser, authorizeUsername){
    const router = express.Router()

    async function checkIfUserExists(req, res, next){
        const username = req.body.username;
        const result = await authorizeUsername(username);
        console.log(result);
    
        if (result){
            console.log('here');
            return next(); 
        }
        res.status(401).json({message: "username already exists"});
    }

// test
    router.post("/create-user", checkIfUserExists, async(req, res)=>{
        const data = req.body;
        console.log('in creation');
        
    try{
        const token = await createUser(data);
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
        const args = Object.values(data)
        const token = await authorizeUser(args);
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