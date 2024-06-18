import couponModel from "../../../DB/models/coupon.model.js";
import productModel from "../../../DB/models/product.model.js";
import orderModel from "../../../DB/models/order.model.js";
import cloudinary from "../../../utils/cloudnairy.js";
import createInvoice from "../../../utils/createinvoice.js";
import { clearCart, updateStock } from "./order.service.js";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import Stripe from "stripe";
import { CatchError } from "../../../utils/catch_error.js";
import nodemailer from 'nodemailer';
import subCategoryModel from "../../../DB/models/subcategory.model.js";
import CartModel from "../../../DB/models/cart.model.js";
import { sendEmail } from "../../../utils/sendEmail.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const createOrder = CatchError(async (req, res, next) => {
  // Data extraction
  const { address, phone, coupon, payment } = req.body;
  const user = req.user;

  // Check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await couponModel.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });

    if (!checkCoupon) return next(new Error("Invalid coupon!"));
  }

  // Check if the cart is empty
  const cart = await CartModel.findOne({ user: user._id });

  if (cart.products.length === 0 && cart.subcategory.length === 0) {
    return next(new Error("Cart is empty!"));
  }

  // Process products in the cart
  let orderProducts = [];
  let orderPrice = 0;
  let orderSubcategories = [];

  for (const cartProduct of cart.products) {
    const product = await productModel.findById(cartProduct.productId);

    if (!product) {
      return next(new Error(`Product ${cartProduct?.productId} not found!`, { cause: 404 }));
    }

    if (!product.inStock(cartProduct.quantity)) {
      return next(new Error(`Sorry, only ${product.availableItems} items of ${product.Name} left in stock!`));
    }

    orderProducts.push({
      productId: cartProduct.productId,
      quantity: cartProduct.quantity,
      name: product.Name, // Fixed: Change 'Name' to 'name'
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * cartProduct.quantity,
    });

    orderPrice += product.finalPrice * cartProduct.quantity;
  }

  // Process subcategories in the cart

  for (const cartSubcategory of cart.subcategory) {
    const subcategory = await subCategoryModel.findById(cartSubcategory.subcategoryId);

    if (!subcategory) {
      return next(new Error(`Subcategory ${cartSubcategory.subcategoryId} not found!`, { cause: 404 }));
    }

    if (!subcategory.inStock(cartSubcategory.quantity)) {
      return next(new Error(`Sorry, only ${subcategory.availableItems} items of ${subcategory.Name} left in stock!`));
    }

    orderSubcategories.push({
      subcategoryId: cartSubcategory.subcategoryId,
      quantity: cartSubcategory.quantity,
      name: subcategory.Name, // Fixed: Change 'Name' to 'name'
      itemPrice: subcategory.finalPrice,
      totalPrice: subcategory.finalPrice * cartSubcategory.quantity,
    });

    orderPrice += subcategory.finalPrice * cartSubcategory.quantity;
  }

  // Create order
  const order = await orderModel.create({
    user: user._id,
    products: orderProducts,
    subcategories: orderSubcategories,
    address,
    phone,
    price: orderPrice,
    payment,
    coupon: {
      couponId: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });

  // Generate invoice
  const itemsdata = [...order.products, ...order.subcategories];

 // Combine products and subcategories
  const invoice = {
    shipping: {
      name: user.Name,
      address: order.address,
      country: "Egypt",
    },
    items: itemsdata,
    subtotal: order.price, // Total price before discounts
    paid: order.finalPrice, // Final paid amount after discounts
    invoice_nr: order._id,
  };
 order.invoice = invoice;
 await order.save();
 
 const invoiceTableHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stylish Invoice Table</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    table {
      width: 100%;
      margin: 20px auto;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover {
      background-color: #e9e9e9;
    }
  </style>
</head>
<body>
<table>
  <thead>
    <tr>
     
      <th>Value</th>
       <th>Field</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      
      <td>${invoice.shipping.name}</td>
      <td>Customer Name : </td>
    </tr>
    <tr>
    
      <td>${invoice.shipping.address}</td>
        <td>Address : </td>
    </tr>
    <tr>
      
      <td>${invoice.shipping.country}</td>
      <td>Country : </td>
    </tr>
    <tr>
     
      <td>${invoice.invoice_nr}</td>
       <td>Invoice Number : </td>
    </tr>
    <tr>
      
      <td>${invoice.subtotal} EG</td>
      <td>Subtotal : </td>
    </tr>
    <tr>
      
      <td>${invoice.paid} EG</td>
      <td>Paid Amount : </td>
    </tr>
    <tr>
      
      <td>
        ${invoice.items.map(item => `
        - ${item.name}<br/>
        `).join('')}
      </td>
      <td>Items : </td>
    </tr>
  </tbody>
</table>
<p style="text-align: center; margin-top: 10px;">Thank you for shopping with us. We hope you are satisfied with our services.</p>
<p style="text-align: center;">Best Wishes:</p>
<h4 style="text-align: center; margin-bottom: 30px;">Clean And Green</h4>
</body>
</html>
`;
const admins = await User.find({ Role: 'admin' });
const adminEmails = admins.map(admin => admin.Email);
  const mailOptions = {
    from: process.env.Email,
    to: [user.Email, ...adminEmails],
    subject: 'Invoice',
    text: 'Order Invoice',
  html:invoiceTableHTML,
  };

const isSent = await sendEmail(mailOptions);
  if(isSent) {
    console.log("Done Payment");
    updateStock([...order.products, ...order.subcategories], true); // Update stock status
   clearCart(user._id); // Clear the user's cart

  }

  
  if (payment === "visa") {
    const stripe = new Stripe(process.env.stripekey);

    let generateCoupon;
    if (order.coupon.name !== undefined) {
      generateCoupon = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }
    
    const lineItems = order.products.map((product) => ({
      price_data: {
        currency: "egp",
        product_data: {
          name: product.name,
        },

        unit_amount: Math.round(product.itemPrice * 100),
      },
      quantity: product.quantity,
    })).concat(order.subcategories.map((subcategory) => ({
      price_data: {
        currency: "egp",
        product_data: {
          name: subcategory.name,
        },
        unit_amount: subcategory.itemPrice * 100,
        unit_amount:Math.round(subcategory.itemPrice * 100),
      },
      quantity: subcategory.quantity,
    })));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
       customer_email: user.Email,
      metadata: { order_id: order._id.toString() },
      success_url: process.env.success,
      cancel_url: process.env.cancel,
      line_items: lineItems,
      discounts: checkCoupon ? [{ coupon: generateCoupon.id }] : [],
      
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Order placed successfully! Check your email for the invoice.",
      payUrl: session.url,
    });
  }

  // Return success response without payment details
  return res.status(201).json({
    success: true,
    message: "Order placed successfully! Check your email for the invoice.",
  });
});


export const cancelOrder = CatchError(async (req, res, next) => {
  // data
  const { orderId } = req.params;

  // check order existence
  const order = await orderModel.findById(orderId);
  if (!order) return next(new Error("Order not found!", { cause: 404 }));

  // check order status
  if (order.status === "shipped" || order.status === "delivered")
    return next(new Error("Can not cancel order!"));

  // cancel order
  order.status = "canceled";
  await order.save();

  // update stock
  updateStock([...order.products, ...order.subcategories], false);

  // send response
  return res.json({ success: true, message: "order canceled successfully!" });
});

export const orderWebhook = CatchError(async (request, response) => {
  // This is your Stripe CLI webhook secret for testing your endpoint locally.
  const sig = request.headers["stripe-signature"];
  let event;
  const stripe = new Stripe(process.env.STRIPE_KEY);

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.ENDPOINT_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the complete event (you can handle the other events)
  const orderId = event.data.object.metadata.order_id;

  if (event.type === "checkout.session.completed") {
    // change order status
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      { status: "visa payed" }
    );
    return response.send();
  }

  // else
  await orderModel.findOneAndUpdate(
    { _id: orderId },
    { status: "failed to pay" }
  );
  return response.send();
});

export const AllOrder=CatchError(async(req,res,next)=>{
  const order= await orderModel.find();
  res.status(200).json({success:true,status:200,order})
})


