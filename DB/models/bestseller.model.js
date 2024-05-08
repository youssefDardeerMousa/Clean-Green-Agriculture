import mongoose, { Types, Schema, model } from "mongoose";


const BestSellerSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    subcategory: [{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    }]
},{
    timestamps: true,
})

export const BestSellerModel=model("BestSeller",BestSellerSchema)