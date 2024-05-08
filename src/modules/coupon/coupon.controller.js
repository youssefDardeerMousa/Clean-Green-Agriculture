import couponModel from "../../../DB/models/coupon.model.js";

import voucher_codes from "voucher-code-generator";
import { CatchError } from "../../../utils/catch_error.js";

export const createCoupon = CatchError(async (req, res, next) => {
  // data
  const { discount, expiredAt } = req.body;

  // generate code name
  const code = voucher_codes.generate({ length: 5 }); // returns []
  // create coupon 
  console.log(code);
  const coupon = await couponModel.create({
    name: code[0],
    discount,
    // 12/6/2023 >> month/day/year
    // getTime() >> to convert date to milliseconds
    expiredAt: new Date(expiredAt).getTime(),
    createdBy: req.user._id,
  });

  // send response
  return res.status(201).json({ success: true, results: coupon });
});

export const updateCoupon = CatchError(async (req, res, next) => {
  // data
  const { discount, expiredAt } = req.body;
  const { code } = req.params;
  console.log(code, discount, expiredAt);

  // check coupon existence
  const coupon = await couponModel.findOne({ name: code });
  if (!coupon) return next(new Error("Coupon not found!", { cause: 404 }));

  // check owner
  if (coupon.createdBy.toString() !== req.user._id.toString())
    return next(new Error("Not Authorized (not the owner)"));

  // check expiration date
  if (coupon.expiredAt < Date.now())
    return next(new Error("Coupon is expired!"));

  // update data if found
  coupon.discount = discount ? discount : coupon.discount;
  coupon.expiredAt = expiredAt
    ? new Date(expiredAt).getTime()
    : coupon.expiredAt;

  // save changes to DB
  await coupon.save();

  // send response
  return res.json({
    success: true,
    results: coupon,
    message: "Coupon Updated Successfully",
  });
});

export const deleteCoupon = CatchError(async (req, res, next) => {
  // data
  const { code } = req.params;
  console.log(code);

  // check coupon existence
  const coupon = await couponModel.findOne({ name: code });
  if (!coupon) return next(new Error("Coupon not found!", { cause: 404 }));

  // check owner
  if (coupon.createdBy.toString() !== req.user._id.toString())
    return next(new Error("Not Authorized (not the owner)"));

  // delete coupon from DB
  await couponModel.findOneAndDelete({ name: code });

  // send response
  res.json({ success: true, message: "Coupon deleted successfully!" });
});

export const allCoupons = CatchError(async (req, res, next) => {
  const coupons = await couponModel.find();

  return res.json({ success: true, results: coupons });
});
