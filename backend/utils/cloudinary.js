import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";


// Configuration
cloudinary.config({ 
    cloud_name: 'dcoxcjazb', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});



export async function uploadImageToCloudinary(path){
    return new Promise((resolve, reject)=>{

        const stream = cloudinary.uploader
        .upload_stream(
            {folder: "spideypedia"},
            (error, result)=>{
                if (error){
                    console.log(error);        
                    return reject(null);
                }
                resolve({
                    url: result.url,
                    publicID: result.public_id
                })          
            }
            
        )
        stream.end(path)
    })
}

export function deleteImage(publicID){
    console.log(publicID);
    console.log(typeof publicID);
    
    
    cloudinary.uploader.destroy(publicID, function(error, result) {
        if (error) {
          console.error("Delete error:", error);
        } else {
          console.log("Delete result:", result);
        }
      });
}
