const developing = false;
const base = developing?"http://localhost:3000":"https://spideypedia-production.up.railway.app";
const wsLink = developing?"ws://localhost:3000":"wss://spideypedia-production.up.railway.app";
const comicsBase = base + "/comics";
const authBase = base + "/auth";
const submitToAgentWs = "ws://127.0.0.1:8000/ws";

export {comicsBase, authBase, submitToAgentWs, wsLink}

