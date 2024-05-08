import joi from "joi";

// create coupon
export const createCouponSchema = joi.object({
    // we will create the name
    discount: joi.number().min(1).max(100).required(),
    expiredAt: joi.date().greater(Date.now()).required(),
}).required()
// expiredAt : Joi.Date().greater(Date.now())
// update coupon
export const updateCouponSchema = joi.object({
    code: joi.string().length(5).required(),
    discount: joi.number().min(1).max(100),
    expiredAt: joi.date().greater(Date.now())
}).required()

// delete coupon
export const deleteCouponSchema = joi.object({
    code: joi.string().length(5).required(),
}).required()