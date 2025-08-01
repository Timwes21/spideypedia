
const developing = false;
const GCPBackend = "https://spideypedia-backend-263835011934.us-east1.run.app"
const base = developing?"http://localhost:8080":GCPBackend;
const wsLink = developing?"ws://localhost:8080":"wss://spideypedia-backend-263835011934.us-east1.run.app";
const comicsBase = base + "/comics";
const authBase = base + "/auth";
const undoRoute = developing? "http://127.0.0.1:8000/undo": "https://intuitive-smile-production.up.railway.app/undo";
const GCPAgent = "https://ai-assiastant-263835011934.europe-west1.run.app";
const RailwayAgent = "wss://intuitive-smile-production.up.railway.app/ws";
const submitToAgentWs = developing?"ws://127.0.0.1:8000/ws":GCPAgent;


export {comicsBase, authBase, submitToAgentWs, wsLink, undoRoute}

