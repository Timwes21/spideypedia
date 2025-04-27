import { fileURLToPath } from 'url'
import { getPhotoPath } from "../db/comics.js";
import fs from "fs";
import path from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

function deleteFolder(partialPath, folder){
    const fullPath = path.join(__dirname, partialPath, folder);
    fs.rm(fullPath, {recursive: true, force: true}, (err)=>{
        if (err){
            console.log(err);
            return;            
        }
        console.log("deleted");
        
    });
}

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try{            
            const partialPath = req.body.path;
            console.log("body: ", req.body);
            
            const token = req.body.token;
            const username = await getUsername(token, productionCollection);
            console.log("username", username);
            const fullPath = username + "/" + partialPath;
            const uploadPath = path.join(__dirname, '../images/', fullPath);
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        }
        catch(err){
            console.log(err);
        }
    },
    filename: function (req, file, cb) {
        if (file){
            cb(null, 'image.png');    
        }    
    }
  });


async function getPhoto(token, char, type, series, vol, issueNumber, collection){
    const photoPath = await getPhotoPath(token, char, type, series, vol, issueNumber, collection);
    const filePath = path.join(__dirname, photoDir, photoPath);
    await fs.promises.access(filePath);
    return filePath;
}

function getDummyPhoto(){
    const filePath = path.join(__dirname, "image.png");
    return filePath;
}
const upload = multer({ storage: storage })

export {upload, deleteFolder, getDummyPhoto, getPhoto}
