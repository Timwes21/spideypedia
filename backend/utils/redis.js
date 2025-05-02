import { createClient } from'redis'

const redisSub = createClient({ url: process.env.REDIS_URL})
const redisPub = createClient({ url: process.env.REDIS_URL})

redisSub.connect();
redisPub.connect();

async function publish(token){
    await redisPub.publish("charUpdates", token);
}

export { redisSub, publish };