
const developing = import.meta.env.VITE_DEVELOPING;
const testingBackendBase = import.meta.env.VITE_BASE_ROUTE;
const testingAIBackendBase = import.meta.env.VITE_AI_BASE_ROUTE;
console.log(testingBackendBase);

const http = developing == "true" ?"http": "https";
const ws = developing == "true"? "ws": "wss"
const backendBase = `${http}://${testingBackendBase}`;
const aiBackend = `${http}://${testingAIBackendBase}`;


const wsLink = `${ws}://${testingBackendBase}`;
const authBase = backendBase + "/auth";
const RailwayAgent = "wss://intuitive-smile-production.up.railway.app/ws";
const submitToAgentWs = developing?"ws://127.0.0.1:8000/ws":RailwayAgent;


const routesMap = {
    addChar: backendBase + "/add-character",
    addIssue: aiBackend + "/add-issue",
    addTitle: backendBase + "/add-title",
    addVol: backendBase + "/add-vol",
    deleteVol: backendBase + "/delete-vol",
    deleteChar: backendBase + "/delete-char",
    deleteIssue: backendBase + "/delete-issue",
    updateDetails: backendBase + "/update-details",
    undoRoute: aiBackend + "/undo",
    createUser: backendBase + "/create-user",
    login: backendBase + "/login",
    logout: backendBase + "/logout",
    wsLink,
    getIssueImage: (imageName, token) => `${aiBackend}/get-issue-image/${imageName}`
    



}

console.log(routesMap);

export { authBase, submitToAgentWs, routesMap }

