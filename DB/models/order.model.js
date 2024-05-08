import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, min: 1 },
        // so we know the price (data) when the product was sold.
        // critical data (changes over time)
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    subcategories: [
      {
        _id: false,
        subcategoryId: { type: Types.ObjectId, ref: "Subcategory" },
        quantity: { type: Number, min: 1 },
        // so we know the price (data) when the product was sold.
        // critical data (changes over time)
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    invoice: { id: String, url: String }, // reciept
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String, // if number zero will be removed
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coupon: {
      couponId: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      enum: [
        "placed",
        "shipped",
        "delivered",
        "canceled",
        "refunded",
        "visa payed",
        "failed to pay",
      ],
      default: "placed",
    },
    payment: {
      type: String,
      enum: ["visa", "cash"],
      default: "cash",
    },
  },
  { timestamps: true }
);

// *************** Virtuals ************ //
orderSchema.virtual("finalPrice").get(function () {
  // this >>> current document >>> order-schema
  return this.coupon.couponId != undefined
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount) / 100
      ).toFixed(2)
    : this.price;
});

const orderModel = mongoose.models.Order || model("Order", orderSchema);

export default orderModel;
