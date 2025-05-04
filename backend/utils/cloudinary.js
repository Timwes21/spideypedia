import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";


// Configuration
cloudinary.config({ 
    cloud_name: 'dcoxcjazb', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});



export async function uploadImageToCloudinary(path){
    try{
        const result = await cloudinary.uploader
        .upload(path, {
            resource_type: "image", 
            public_id: path,
            overwrite: true
        })
        console.log(result);   
        return {url: result.url, publicID: result.public_id};
    }
    catch{
        return null;
    }
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
