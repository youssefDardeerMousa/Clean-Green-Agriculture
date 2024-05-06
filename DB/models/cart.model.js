import mongoose, { Types, Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    
    },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product" , required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    
    subcategory: [
      {
        _id: false,
        subcategoryId: { type: Types.ObjectId, ref: "Subcategory" , required: true},
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.models.Cart || model("Cart", cartSchema);

export default CartModel;
