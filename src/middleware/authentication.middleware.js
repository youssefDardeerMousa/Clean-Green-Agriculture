import jwt from 'jsonwebtoken'
import { User } from '../../DB/models/user.model.js';
import { CatchError } from '../../utils/catch_error.js';
import { Token } from '../../DB/models/token.model.js';
import dotenv from 'dotenv'
dotenv.config()
export const isAuthenticated =CatchError(async(req,res,next)=>{
    // check token exist 
    let {token}=req.headers;
    
    if(!token){
        return next(new Error('Token is Required !',{cause:400}))
    }
    if(!token.startsWith(process.env.bearerkey)){
        return next(new Error('InValid Token !',{cause:400}))
    }
    //check payload 
    token=token.split(process.env.bearerkey)[1]
     //check token in DB
     const tokenDB=await Token.findOne({token},{isValid:true})
     if (!tokenDB){
         return next(new Error('Token expired or Error Token !',{cause:400})) 
     }

    const decoded=jwt.verify(token,process.env.tokenkey)
    if(!decoded){
        return next(new Error('InValid Token !',{cause:400}))
    }
   
    //check user 
    const user =await User.findOne({Email:decoded.email})
    if (!user){
        return next(new Error('Not Found User !',{cause:404})) 
    }
    //pass User
    req.user=user
    req.header=token
    //return next
    return next()
})