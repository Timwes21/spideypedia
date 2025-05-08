const developing = true;
const base = developing?"http://localhost:3000":"https://spideypedia-production.up.railway.app";
const wsLink = developing?"ws://localhost:3000":"wss://spideypedia-production.up.railway.app";
const comicsBase = base + "/comics";
const authBase = base + "/auth";
const submitToAgentApi = base + "/agent/convo";

export {comicsBase, authBase, submitToAgentApi, wsLink}

