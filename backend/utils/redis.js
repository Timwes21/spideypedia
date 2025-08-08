import { createClient } from'redis'

const redisSub = createClient({ url: process.env.REDIS_URL})
const redisPub = createClient({ url: process.env.REDIS_URL})

redisSub.connect();
redisPub.connect();

async function publish(token){
    try{
        await redisPub.publish("charUpdates", token);
    }
    catch{
        console.log("redis timed out");
        
    }
}

function getRedisSub(){
    return redisSub
}

export { getRedisSub, publish };