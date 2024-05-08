import { Schema, Types, model }  from "mongoose";
//Schema
const categorySchema=new Schema({
    Name:{
        type:String,
        required:true,
        min:4,
        max:30,
    },
    Slug:{
        type:String,
        required:true
    },
    Image:{
        url:{type:String,required:true},
        id:{type:String,required:true}
    },
    CreatedBy:{type:Types.ObjectId,ref:'User'}
},{timestamps:true,toJSON:{virtuals:true}});
//Model
// virtual when there is relation
categorySchema.virtual('subcategory',{
    ref : "Subcategory",
    localField : '_id',
    foreignField:'categoryId'
})
export const Category=model("Category",categorySchema)
