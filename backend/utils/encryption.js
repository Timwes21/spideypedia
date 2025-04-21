import crypto from 'crypto';
import 'dotenv/config';

const key = Buffer.from(process.env["KEY"], 'hex');
const algo = process.env["ALGORITHM"];
    
function encrypt(text){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algo, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encrypted: encrypted
    };
}

function decrypt(iv, encrypted){
    const decipher = crypto.createDecipheriv(algo, key, Buffer.from(iv, 'hex'));
    let text = decipher.update(encrypted, 'hex', 'utf-8');
    text += decipher.final('utf-8');
    return text;
}

const getToken = () => crypto.randomBytes(64).toString('hex')


export {encrypt, decrypt, getToken};
