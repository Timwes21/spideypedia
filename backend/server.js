import express from 'express';
import cors from 'cors';
import http from 'http';
import authRouter from './routes/auth-route.js';
import agentRouter from './routes/talk-to-agent-route.js';
import collectionRouter from './routes/update-collection-route.js';
import { createUser, authorizeUsername, authorizeUser, forgetUserToken} from './db/auth.js';
import {productionCollection } from './db/db.js'
import { updateCollectionRouteHandler, getCharacters} from './db/update-collection.js';
import Agent from './agents/agent.js';
import ws from './routes/websocket.js';
import 'dotenv/config';
import { publish, redisSub } from './utils/redis.js';

const app = express();
const server = http.createServer(app);
app.use(express.json());
const collection = productionCollection;
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
app.use('/comics', collectionRouter(updateCollectionRouteHandler, publish, collection));
app.use('/agent', agentRouter(Agent, collection));


server.listen(process.env.PORT, () => console.log("Comic Log Server running on port 3000"));