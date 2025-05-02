import express from 'express';
import cors from 'cors';
import http from 'http';
import authRouter from './routes/auth.js';
import agentRouter from './routes/talk-to-agent.js';
import collectionRouter from './routes/update-collection.js';
import { createUser, authorizeUsername, authorizeUser} from './db/users.js';
import {productionCollection } from './db/db.js'
import { addToCharacter, addCharacter, getCharacters, AddIssue, deleteIssue, updateDetails, getPhotoPath} from './db/comics.js';
import Agent from './agents/agent.js';
import ws from './routes/websocket.js';
import 'dotenv/config';
import { redisPub, redisSub } from './utils/redis.js';

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors({ 
    // origin: 'http://localhost:5s173', 
    origin: 'https://spideypedia.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}, ));

ws(server, getCharacters, redisSub, productionCollection);
app.use('/auth', authRouter(createUser, authorizeUser, authorizeUsername, productionCollection));
app.use('/comics', collectionRouter(addToCharacter, addCharacter, AddIssue, deleteIssue, updateDetails, redisPub, productionCollection));
app.use('/agent', agentRouter(redisPub, Agent, productionCollection));


server.listen(3000, () => console.log("Comic Log Server running on port 3000"));