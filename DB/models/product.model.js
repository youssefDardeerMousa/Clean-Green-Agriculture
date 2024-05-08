import mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
   
    Name: { type: String, required: true, min: 5, max: 20 },
   
    description: String,
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    availableItems: { type: Number, min: 1, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    discount: { type: Number, min: 1, max: 100 }, // %
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    subcategoryId: { type: Types.ObjectId, ref: "Subcategory", required: true },
    cloudFolder: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// *************** Virtuals ************ //
productSchema.virtual("finalPrice").get(function () {
  // this >>> current document >>> product-schema
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
  }
});

// *************** Stock method ************ //
productSchema.methods.inStock = function (requiredQuantity) {
  // this >>> current document >>> product-schema
  return this.availableItems >= requiredQuantity ? true : false;
};

const productModel =  model("Product", productSchema);

export default productModel;
