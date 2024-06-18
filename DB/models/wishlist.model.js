import mongoose, { Types, Schema, model } from "mongoose";

const wishlistSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product", required: true }
      },
    ],
    subcategories: [
      {
        _id: false,
        subcategoryId: { type: Types.ObjectId, ref: "Subcategory", required: true }
      },
    ],
  },
  { timestamps: true }
);

export const WishlistModel = mongoose.models.Wishlist || model("Wishlist", wishlistSchema);

