import Joi from 'joi';

export const articleValidationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  image: Joi.string(),
  publishedDate: Joi.date().default(Date.now),
  createdBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
}).required();
