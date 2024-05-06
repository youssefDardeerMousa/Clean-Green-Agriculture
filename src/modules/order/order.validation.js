import joi from "joi";
import { IsValidObjectId } from "../../middleware/validation.middleware.js";

// create order
export const createOrderSchema = joi
  .object({
    address: joi.string().min(10).required(),
    phone: joi.string().length(11).required(),
    coupon: joi.string().length(5),
    payment: joi.string().valid("cash", "visa").required(),
  })
  .required();

  // cancel order
  export const cancelOrderSchema = joi.object({
    orderId: joi.string().custom(IsValidObjectId).required()
  }).required()
