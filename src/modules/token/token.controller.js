import { Token } from "../../../DB/models/token.model.js";
import { CatchError } from "../../../utils/catch_error.js";

export const allTokens=CatchError(async(req,res,next)=>{
    let tokens= await Token.find()
    res.status(200).json({status:200,result:true,tokens})
})