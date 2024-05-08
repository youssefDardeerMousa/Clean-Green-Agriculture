import {v2 as cloudinary} from 'cloudinary';
    import dotenv from 'dotenv'

 dotenv.config()
cloudinary.config({ 
  cloud_name: process.env.cloudname, 
  api_key: process.env.apikey,
  api_secret: process.env.apisekret
});

export default cloudinary