import joi from "joi";

// add to cart -- update cart
export const cartSchema = joi
  .object({
    productId: joi.string().required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

// removeProductFromCart
export const removeProductFromCartSchema = joi
  .object({
    productId: joi.string().required(),
  })
  .required();
