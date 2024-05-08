import mongoose, { Schema, Types, model } from "mongoose";

// Coupon for all the order discount for the product
const couponSchema = new Schema(
  {
    name: { type: String, unique: true, required: true }, // 584g2
    discount: { type: Number, min: 1, max: 100, required: true },
    expiredAt: Number,
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema);

export default couponModel;
