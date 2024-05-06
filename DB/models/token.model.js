import  { Schema, Types, model }  from "mongoose";

const tokenSchema=new Schema({
token:{
    type:String,
    required:true
},
user:{
    type:Types.ObjectId,
    ref:'User'
},
isValid:{
type:Boolean,
default:true
},

agent :{
    type:String
},
expiredAt:{type:String},
ProfileImage:{
    Url:{
        type:String,
        default:"https://res.cloudinary.com/dhbl4eauf/image/upload/v1707396171/Clean%20And%20Green/User/ImageProfile_wvhm5x.jpg"
    },
    id:{
        type:String,
        default:"ImageProfile_wvhm5x"
    }
    
}

},{timestamps:true});

export const Token=model('Token',tokenSchema)