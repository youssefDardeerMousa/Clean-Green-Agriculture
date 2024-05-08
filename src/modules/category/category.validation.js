
import Joi from "joi";
import  { Types } from "mongoose";

 const isValidObjectId=(value,helper)=>{
    //value is the coming from request
    console.log("value is ", value);
    if(Types.ObjectId.isValid(value)){
        return true
    }
    else{
        return helper.message("Invalid ObjectId!")
    }
//     // another code Types.ObjectId.isValid(value)?true:helper.message("Invalid ObjectId!")
}
// create category

export const createCategorySchema=Joi.object({
    Name:Joi.string().min(4).max(30).required(),
    // CreatedBy:Joi.string().custom(isValidObjectId)
}).required()

// Update Category
export const UpdateCategorySchema=Joi.object({
    Name:Joi.string().min(4).max(30).required(),
    categoryId:Joi.string().custom(isValidObjectId)
}).required()

//DeleteCategorySchema
export const DeleteCategorySchema=Joi.object({
    categoryId:Joi.string().custom(isValidObjectId)
}).required()