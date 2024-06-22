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
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    subcategory: [
      {
        _id: false,
        subcategoryId: { type: Types.ObjectId, ref: "Subcategory", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

// Virtual for total price before discount
cartSchema.virtual('totalPriceBeforeDiscount').get(function() {
  let totalProductPrice = 0;
  this.products.forEach(product => {
    if (product.productId && product.productId.price) {
      totalProductPrice += product.productId.price * product.quantity;
    }
  });

  let totalSubcategoryPrice = 0;
  this.subcategory.forEach(subcategory => {
    if (subcategory.subcategoryId && subcategory.subcategoryId.price) {
      totalSubcategoryPrice += subcategory.subcategoryId.price * subcategory.quantity;
    }
  });

  return {
    product: totalProductPrice,
    subcategory: totalSubcategoryPrice
  };
});

// Virtual for total final price after discount
cartSchema.virtual('totalFinalPriceAfterDiscount').get(function() {
  let totalProductFinalPrice = 0;
  this.products.forEach(product => {
    if (product.productId && product.productId.finalPrice) {
      totalProductFinalPrice += product.productId.finalPrice * product.quantity;
    }
  });

  let totalSubcategoryFinalPrice = 0;
  this.subcategory.forEach(subcategory => {
    if (subcategory.subcategoryId && subcategory.subcategoryId.finalPrice) {
      totalSubcategoryFinalPrice += subcategory.subcategoryId.finalPrice * subcategory.quantity;
    }
  });

  return {
    product: totalProductFinalPrice,
    subcategory: totalSubcategoryFinalPrice
  };
});

// Virtual for payment price
cartSchema.virtual('Paymentprice').get(function() {
  return this.totalFinalPriceAfterDiscount.product + this.totalFinalPriceAfterDiscount.subcategory;
});

// Virtual for item counts
cartSchema.virtual('itemCounts').get(function() {
  const productCount = this.products.length;
  const subcategoryCount = this.subcategory.length;
  return {
    productCount,
    subcategoryCount,
    totalCount: productCount + subcategoryCount
  };
});

// Ensure virtual fields are serialised
cartSchema.set('toObject', { virtuals: true });
cartSchema.set('toJSON', { virtuals: true });

const CartModel = mongoose.models.Cart || model("Cart", cartSchema);

export default CartModel;
