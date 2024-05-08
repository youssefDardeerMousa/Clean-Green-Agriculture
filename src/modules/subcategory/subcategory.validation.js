import joi from "joi";
import { IsValidObjectId } from "../../middleware/validation.middleware.js";
export const createSubCategorySchema = joi
  .object({
    Name: joi.string().min(5).required(),
    categoryId: joi.string().required(),
    description: joi.string().required(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100)
  })
  .required();

// update
export const updateSubCategorySchema = joi
  .object({
    name: joi.string().min(5),
    categoryId: joi.string().custom(IsValidObjectId).required(),
    subcategoryId: joi.string().custom(IsValidObjectId).required(),
  })
  .required();

// delete
export const deleteSubCategorySchema = joi
  .object({
    categoryId: joi.string().custom(IsValidObjectId).required(),
    subcategoryId: joi.string().custom(IsValidObjectId).required(),
  })
  .required();

  export const SubCategorySchema = joi
  .object({
    subcategoryId: joi.string().required(),
    categoryId:joi.string().required()
  })
  .required();
