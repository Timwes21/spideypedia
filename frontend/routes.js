
const developing = false;
const railwayBackend = "https://spideypedia-production.up.railway.app"
const GCPBackend = "https://spideypedia-backend-263835011934.us-east1.run.app"
const base = developing?"http://localhost:3000":GCPBackend;
const wsLink = developing?"ws://localhost:3000":"wss://spideypedia-production.up.railway.app";
const comicsBase = base + "/comics";
const authBase = base + "/auth";
const undoRoute = developing? "http://127.0.0.1:8000/undo": "https://intuitive-smile-production.up.railway.app/undo";
const submitToAgentWs = developing?"ws://127.0.0.1:8000/ws":"wss://intuitive-smile-production.up.railway.app/ws";


export {comicsBase, authBase, submitToAgentWs, wsLink, undoRoute}

