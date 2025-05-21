import express from 'express';
import cors from 'cors';
import http from 'http';
import authRouter from './routes/auth.js';
import agentRouter from './routes/talk-to-agent.js';
import collectionRouter from './routes/update-collection.js';
import { createUser, authorizeUsername, authorizeUser, forgetUserToken} from './db/users.js';
import {productionCollection } from './db/db.js'
import { updateCollectionRouteHandler, getCharacters} from './db/comics.js';
import Agent from './agents/agent.js';
import ws from './routes/websocket.js';
import 'dotenv/config';
import { publish, redisSub } from './utils/redis.js';

const app = express();
const server = http.createServer(app);
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://spideypedia.com"]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

ws(server, getCharacters, redisSub, productionCollection);
app.use('/auth', authRouter(createUser, authorizeUser, authorizeUsername, forgetUserToken, productionCollection));
app.use('/comics', collectionRouter(updateCollectionRouteHandler, publish, productionCollection));
app.use('/agent', agentRouter(Agent, productionCollection));


server.listen(3000, () => console.log("Comic Log Server running on port 3000"));