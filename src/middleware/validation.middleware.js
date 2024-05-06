import  { Types } from "mongoose";

export const IsValidObjectId = (value) => {
    return Types.ObjectId.isValid(value)
      ? true
      : false
  };
  

export const isValid=(schema)=>{
   
return (req,res,next)=>{
    const data={...req.body,...req.params,...req.query}
   
    const check=schema.validate(data,{abortEarly:false})
if(check.error){
    const message=check.error.details.map((error)=>error.message)
    return next(new Error(message,{cause:400}))
}
return next()
}

}

