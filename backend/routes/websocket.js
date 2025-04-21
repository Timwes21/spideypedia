import { WebSocketServer } from 'ws';

async function ws(server, getCharacters, redisSub){
    const wss = new WebSocketServer({ server });
    redisSub.subscribe("charUpdates", async(message)=>{
        const token = message;
        const updatedChars = await getCharacters(token);
        
    wss.clients.forEach(client=>{
        if (client.readyState === client.OPEN && client.token === token){
            client.send(JSON.stringify({message: updatedChars}))
        }
    })
})

    wss.on("connection", (ws)=>{
        ws.on("message", async(message)=>{
            try{
                const token = JSON.parse(message);
                ws.token = token;
                const chars = await getCharacters(token);
                ws.send(JSON.stringify({message: chars}));
            }
            catch(err){
                console.log(err);
                ws.send(JSON.stringify({message: "Something went wrong, try again later"}));
            }
        })

        ws.on("close", ()=>{
            console.log("ws closed");
        
        })
    })

    return wss;

}

export default ws