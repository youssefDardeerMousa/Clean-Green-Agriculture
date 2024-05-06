// we can make them as methods in the models

import cartModel from "../../../DB/models/cart.model.js";
import productModel from "../../../DB/models/product.model.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";

// clear cart
export const clearCart = async (userId) => {
  await cartModel.findOneAndUpdate({ user: userId }, { products: [],subcategory:[] });
};

// update stock
export const updateStock = async (products, placeOrder) => {
  // placeOrder >> true (place order) || false (cancel order)
  console.log("order ", products);
  if (placeOrder) {
    for (const cartProduct of products) {
      if(cartProduct.productId){
        await productModel.findOneAndUpdate(cartProduct.productId, {
          $inc: {
            availableItems: -cartProduct.quantity, // decrease
            soldItems: cartProduct.quantity, // increase
          },
        });
      }
      else if(cartProduct.subcategoryId){
        await subCategoryModel.findOneAndUpdate(cartProduct.subcategoryId, {
          $inc: {
            availableItems: -cartProduct.quantity, // decrease
            soldItems: cartProduct.quantity, // increase
          },
        });
      }
    }
  } else {
    for (const cartProduct of products) {
      if(cartProduct.productId){
        await productModel.findOneAndUpdate(cartProduct.productId, {
          $inc: {
            availableItems: cartProduct.quantity, // increase
            soldItems: -cartProduct.quantity, // decrease
          },
        });
      }
      else if(cartProduct.subcategoryId){
        await subCategoryModel.findOneAndUpdate(cartProduct.subcategoryId, {
          $inc: {
            availableItems: cartProduct.quantity, // increase
            soldItems: -cartProduct.quantity, // decrease
          },
        });
      }
    }
  }
};


// export const updateStock = async (items, placeOrder) => {
//   console.log("items" , items);
//   for (const item of items) {
//     if (item.productId) { // If it's a product
//       const product = item.productId;
//       const quantity = item.quantity;

//       const update = placeOrder
//         ? {
//             availableItems: -quantity,
//             soldItems: quantity,
//           }
//         : {
//             availableItems: quantity,
//             soldItems: -quantity,
//           };

//       await productModel.findOneAndUpdate({ _id: product }, {
//         $inc: update,
//       });
//     } else if (item.subcategoryId) { // If it's a subcategory
//       const subcategory = item.subcategoryId;
//       const quantity = item.quantity;

//       const update = placeOrder
//         ? {
//             availableItems: -quantity,
//             soldItems: quantity,
//           }
//         : {
//             availableItems: quantity,
//             soldItems: -quantity,
//           };

//       await subcategoryModel.findOneAndUpdate({ _id: subcategory }, {
//         $inc: update,
//       });
//     }
//   }
// };

