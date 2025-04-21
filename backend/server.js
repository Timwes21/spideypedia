import express from 'express';
import cors from 'cors';
import http from 'http';
import authRouter from './routes/auth.js';
import agentRouter from './routes/talk-to-agent.js';
import collectionRouter from './routes/update-collection.js';
import { createUser, authorizeUsername, authorizeUser} from './db/users.js';
import { addToCharacter, addCharacter, getCharacters, AddIssue} from './db/comics.js';
import Agent from './agent/agent.js';
import ws from './routes/websocket.js';
import 'dotenv/config';
import { redisPub, redisSub } from './utils/redis.js';

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));


ws(server, getCharacters, redisSub);
app.use('/auth', authRouter(createUser, authorizeUser, authorizeUsername));
app.use('/comics', collectionRouter(addToCharacter, addCharacter, AddIssue, redisPub));
app.use('/agent', agentRouter(redisPub, Agent));


server.listen(3000, () => console.log("Comic Log Server running on port 3000"));