import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

export const addToWishlistValidation = Joi.object({
  id: Joi.string().custom(objectIdValidation).required(),
});

export const removeFromWishlistValidation = Joi.object({
  id: Joi.string().custom(objectIdValidation).required(),
});
