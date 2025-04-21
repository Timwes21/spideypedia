import { createClient } from'redis'

const redisSub = createClient({ url: process.env.REDIS_URL})
const redisPub = createClient({ url: process.env.REDIS_URL})

await redisSub.connect();
await redisPub.connect();

export { redisSub, redisPub };