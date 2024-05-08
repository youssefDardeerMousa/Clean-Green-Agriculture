import { CatchError } from '../../utils/catch_error.js';
export const isAuthorized =(Role)=>{
    
return CatchError( (req,res,next)=>{
    const user=req.user // user came from authentication
    if(Role!==user.Role){
        return next(new Error("You are not Authorized",{
            cause:403
        }))
    }
    return next()
})
}
    
