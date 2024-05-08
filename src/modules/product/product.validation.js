import joi from "joi";
import { IsValidObjectId } from "../../middleware/validation.middleware.js";

// create product
export const createProductSchema = joi
  .object({
    Name: joi.string().required().min(2).max(20),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    categoryId: joi.string(),
    subcategoryId: joi.string()
  })
  .required();

// delete product + get single product
export const productIdSchema = joi
  .object({
    productId: joi.string().custom(IsValidObjectId).required(),
  })
  .required();
