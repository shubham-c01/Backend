import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
  // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret:process.env.CLOUD_API_SECRET  // Click 'View API Keys' above to copy your API secret
    });

// Upload an image
     const UploadonCloudinary=async (locafilepath)=>{
      try {
       if (!locafilepath) return null;
        const result=await cloudinary.uploader.upload(locafilepath,{
          folder:'images',
       resource_type:'auto'
      })
             fs.unlinkSync(locafilepath)
             return result

        
       
       
       
      } catch (error){
       fs.unlinkSync(locafilepath)//remove the locally saved file if upload failed on cloud
       return null
       

      } 
       
       
      
     

     }

export {UploadonCloudinary}