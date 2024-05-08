import Joi from "joi";

export const bestsellerschema=Joi.object({
    id:Joi.string().required()
})