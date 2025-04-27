import { decrypt } from '../utils/encryption.js';

function withDecryptToken(handler){
    return async function(token, ...args){
        const rawToken = decryptToken(token);
        return await handler(rawToken, ...args);
    }
}

function decryptToken(unparsedToken){
    
    const token = JSON.parse(unparsedToken);
    const { iv, encrypted } = token;
    const rawToken = decrypt(iv, encrypted);
    return rawToken;

}

export {withDecryptToken, decryptToken};