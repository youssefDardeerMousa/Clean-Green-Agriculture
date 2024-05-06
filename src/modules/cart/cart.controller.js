import productModel from "../../../DB/models/product.model.js";
import cartModel from "../../../DB/models/cart.model.js";
import { CatchError } from "../../../utils/catch_error.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";
import CartModel from "../../../DB/models/cart.model.js";

export const addToCart = CatchError(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  const product = await productModel.findById(productId);
  const subcategory = await subCategoryModel.findById(productId);

  if (product && !subcategory) {
    if (!product.inStock(quantity)) {
      return next(new Error(`Sorry, only ${product.availableItems} items left in stock!`));
    }

    const cart = await CartModel.findOne({ user: userId });

    if (cart) {
      const existingProductIndex = cart.products.findIndex((p) => String(p.productId) === String(productId));
      if (existingProductIndex !== -1) {
        const newQuantity = cart.products[existingProductIndex].quantity += quantity;
        if (newQuantity <= product.availableItems) {
          cart.products[existingProductIndex].quantity = newQuantity;
         
        } else {
          return next(new Error(`Sorry , only ${product.availableItems} items left one the stock!`));
        }
      } else {
        cart.products.push({ productId, quantity });
      }
    } 

    await cart.save();

    return res.json({
      success: true,
      message: "Product added/updated successfully!",
      results: cart
    });
  } else if (!product && subcategory) {
    if (!subcategory.inStock(quantity)) {
      return next(new Error(`Sorry, only ${subcategory.availableItems} items left in stock!`));
    }

    let cart = await CartModel.findOne({ user: userId });

    if (cart) {
      const existingSubcategoryIndex = cart.subcategory.findIndex((s) => String(s.subcategoryId) === String(productId));
      if (existingSubcategoryIndex !== -1) {
        const newQuantity = cart.subcategory[existingSubcategoryIndex].quantity += quantity;
        if (newQuantity <= subcategory.availableItems) {
          cart.subcategory[existingSubcategoryIndex].quantity = newQuantity;
        } else {
          return next(new Error(`Sorry , only ${subcategory.availableItems} items left one the stock!`));
        }
      } else {
        cart.subcategory.push({ subcategoryId: productId, quantity });
      }
    } 

    await cart.save();

    return res.json({
      success: true,
      message: "Subcategory added/updated successfully!",
      results: cart
    });
  }

  return next(new Error("Product or Subcategory not found", { cause: 404 }));
});



export const userCart = CatchError(async (req, res, next) => {
  const userId = req.user._id;
  
  const cart = await CartModel.findOne({ user: userId }).populate([
    {
      path: "products.productId",
      select: "defaultImage.url _id Name Slug description images.url availableItems price discount finalPrice",
    },
    {
      path: "subcategory.subcategoryId",
      select: "Image.Url _id Name Slug description images.url availableItems price discount finalPrice",
    }
  ]);

  if (!cart) return next(new Error("Cart not found", { status: 404 }));

  // Calculate total price and final price for products
  //for each product old price
  let totalProductPrice = 0;
  cart.products.forEach((product) => {
    const price = product.productId.price;
    const quantity = product.quantity;
    totalProductPrice += price * quantity;
  });

  // Calculate total final price for products
   //for each product new price
  let totalProductFinalPrice = 0;
  cart.products.forEach((product) => {
    const finalPrice = product.productId.finalPrice;
    const quantity = product.quantity;
    totalProductFinalPrice += finalPrice * quantity;
  });

  // Calculate total price and final price for subcategories
  let totalSubcategoryPrice = 0;
  cart.subcategory.forEach((subcategory) => {
    const price = subcategory.subcategoryId.price;
    const quantity = subcategory.quantity;
    totalSubcategoryPrice += price * quantity;
  });

  // Calculate total final price for subcategories
  let totalSubcategoryFinalPrice = 0;
  cart.subcategory.forEach((subcategory) => {
    const finalPrice = subcategory.subcategoryId.finalPrice;
    const quantity = subcategory.quantity;
    totalSubcategoryFinalPrice += finalPrice * quantity;
  });
  let Paymentprice=0;
  Paymentprice+=totalProductFinalPrice+totalSubcategoryFinalPrice
  // Send response with total price and total final price
  return res.json({
    success: true,
    results: cart,
    totalPriceBeforeDescount: {
      product: totalProductPrice,
      subcategory: totalSubcategoryPrice,
    },
    totalFinalPriceAfterDescount: {
      product: totalProductFinalPrice,
      subcategory: totalSubcategoryFinalPrice,
    },
    Paymentprice
  });
});


export const updateCart = CatchError(async (req, res, next) => {
  // Data
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  // Check product and subcategory existence
  const product = await productModel.findById(productId);
  const subcategory = await subCategoryModel.findById(productId);

  // Check if product or subcategory exists
  if (!product && !subcategory) {
    return next(new Error("Product or Subcategory not found", { cause: 404 }));
  }

  // Check stock for product
  if (product && !product.inStock(quantity)) {
    return next(new Error(`Sorry, only ${product.availableItems} items left in the stock!`));
  }

  // Check stock for subcategory
  if (subcategory && !subcategory.inStock(quantity)) {
    return next(new Error(`Sorry, only ${subcategory.availableItems} items left in the stock for subcategory!`));
  }

  let cart = await CartModel.findOne({ user: userId });

  if (cart) {
    // Update product quantity
    if (product) {
      const existingProductIndex = cart.products.findIndex((p) => String(p.productId) === String(productId));
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

    }

    // Update subcategory quantity
    if (subcategory) {
      const existingSubcategoryIndex = cart.subcategory.findIndex((s) => String(s.subcategoryId) === String(productId));
      if (existingSubcategoryIndex !== -1) {
        cart.subcategory[existingSubcategoryIndex].quantity = quantity;
      } else {
        cart.subcategory.push({ subcategoryId: productId, quantity });
      }
    }

    // Save the updated cart
     await cart.save();

    return res.json({
      success: true,
      message: "Cart updated successfully",
      results: cart,
    });
  }

  return next(new Error("Cart not found", { status: 404 }));
});


export const removeProductFromCart = CatchError(async (req, res, next) => {
  // data
  const { productId } = req.params;
  const userId = req.user._id;

  const product = await productModel.findById(productId);
  const subcategory = await subCategoryModel.findById(productId);
  if(product && !subcategory){
 // check product existence then remove
 const cart = await cartModel.findOneAndUpdate(
  { user: userId, "products.productId": productId },
  { $pull: { products: { productId: productId } } }, // pull deletes
  { new: true }
);

if (!cart) return next(new Error("Product not found!", { cause: 404 }));

// send response
return res.json({
  success: true,
  message: "Product removed successfully",
  results: cart,
});
  }
  if(!product && subcategory){
    // check product existence then remove
    const cart = await cartModel.findOneAndUpdate(
     { user: userId, "subcategory.subcategoryId": productId },
     { $pull: { subcategory: { subcategoryId: productId } } }, // pull deletes
     { new: true }
   );
   
   if (!cart) return next(new Error("subcategory not found!", { cause: 404 }));
   
   // send response
   return res.json({
     success: true,
     message: "subcategory removed successfully",
     results: cart,
   });
     }
});

export const clearCart = CatchError(async (req, res, next) => {
  // data
  const userId = req.user._id;

  // clear cart
  const cart = await cartModel.findOneAndUpdate(
    { user: userId },
    { products: [] ,subcategory:[]},
    { new: true }
  );

  // send response
  return res.json({
    success: true,
    message: "Cart cleared successfully",
    results: cart,
  });
});
