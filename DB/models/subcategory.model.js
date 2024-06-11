import { Schema, Types, model, mongoose } from "mongoose";

const subCategorySchema = new Schema(
  {
    Name: { type: String, required: true, min: 5},
    Slug: { type: String, required: true },
    Image: {
      Id: { type: String, required: true },
      Url: { type: String, required: true },
    },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    categoryId: [{
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    }],
    description: String,
  availableItems: { type: Number, min: 1, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    discount: { type: Number, min: 1, max: 100 },
    cloudFolder: { type: String, unique: true, required: true },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    }  },
  { 
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

   }
);
// *************** Virtuals ************ //
subCategorySchema.virtual("finalPrice").get(function () {
  // this >>> current document >>> product-schema
<<<<<<< HEAD
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
=======
  // if (this.price) {
  //   return Number.parseFloat(
  //     this.price - (this.price * this.discount || 0) / 100
  //   ).toFixed(2);
  // }
  if (this.price) {
    return Math.round(this.price - (this.price * this.discount || 0) / 100)
>>>>>>> 1a5dd29f58388354726b79b9d3962c79f9ccacf4
  }
});

// *************** Stock method ************ //
subCategorySchema.methods.inStock = function (requiredQuantity) {
  // this >>> current document >>> product-schema
  return this.availableItems >= requiredQuantity ? true : false;
};
const subCategoryModel = model("Subcategory", subCategorySchema);

export default subCategoryModel;