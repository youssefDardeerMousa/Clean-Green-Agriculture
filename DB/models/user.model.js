import mongoose, { Schema, model } from "mongoose";
const userSchema=new Schema({
    Name:{
        type:String,
        required:true,
        min:3,
        max:30
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    Password:{
        type:String,
        required:true
    },
    RePassword:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        enum:['online','offline'],
        default:'offline'
    },
    Role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    IsConfirmed:{
        type:Boolean,
        default:false
    },
    ForgetCode:String,
    activationCode:String
},{timestamps:true});

export const User=model("User",userSchema)
