import Joi from "joi";

export const contactusSchema=Joi.object({
    Name:Joi.string().required(),
    Email:Joi.string().email().required(),
    Phone:Joi.string().required(),
    Message:Joi.string().required()
}).required()