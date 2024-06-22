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

// Virtual property for product count
wishlistSchema.virtual('productCount').get(function () {
  return this.products.length;
});

// Virtual property for subcategory count
wishlistSchema.virtual('subcategoryCount').get(function () {
  return this.subcategories.length;
});

// Virtual property for total count
wishlistSchema.virtual('totalCount').get(function () {
  return this.productCount + this.subcategoryCount;
});

// Ensure virtual fields are serialized
wishlistSchema.set('toJSON', { virtuals: true });
wishlistSchema.set('toObject', { virtuals: true });

export const WishlistModel = mongoose.models.Wishlist || model("Wishlist", wishlistSchema);
