import { createClient } from'redis'

const redisSub = createClient({ url: process.env.REDIS_URL})
const redisPub = createClient({ url: process.env.REDIS_URL})

redisSub.connect();
redisPub.connect();

export { redisSub, redisPub };