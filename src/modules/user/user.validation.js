import Joi from "joi";
//register
export const registerSchema=Joi.object({
    Name : Joi.string().min(3).max(30).required(),
    Email :Joi.string().email().required() ,
    Password : Joi.string().required(),
    RePassword : Joi.string().valid(Joi.ref("Password")).required()
}).required()

//activate account

export const activateSchema=Joi.object({
    activationCode:Joi.string().required()
}).required()

// Login Schema
export const loginSchema=Joi.object({
    Email : Joi.string().email().required(),
    Password : Joi.string().required()
}).required();

// Send Forget Code
export const forgetCodeSchema=Joi.object({
    Email : Joi.string().email().required(),
}).required();

// resetPassword resetPasswordSchema
export const resetPasswordSchema=Joi.object({
    ForgetCode : Joi.string().required(),
    Password : Joi.string().required(),
    RePassword:Joi.string().valid(Joi.ref("Password")).required()
}).required();

export const roleSchema=Joi.object({
    Email:Joi.string().email().required()
}).required();
