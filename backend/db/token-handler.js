import { decrypt } from '../utils/encryption.js';

function withDecryptToken(req, res, next){
    console.log("body there: ", req.body);
    
    const unparsedToken = req.body.token; 
    const token = decryptToken(unparsedToken);
    req.body.token = token;
    next();
}

function decryptToken(unparsedToken){
    
    const token = JSON.parse(unparsedToken);
    const { iv, encrypted } = token;
    const rawToken = decrypt(iv, encrypted);
    return rawToken;

}

export { withDecryptToken, decryptToken };