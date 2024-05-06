import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import { cartSchema, removeProductFromCartSchema } from "./cart.validation.js";
import {
  addToCart,
  updateCart,
  userCart,
  removeProductFromCart,
  clearCart,
} from "./cart.controller.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
const router = Router();
// CRUD

// add to cart
router.post("/", isAuthenticated, isValid(cartSchema), addToCart);

// read
router.get("/", isAuthenticated, userCart);

// update
router.patch("/", isAuthenticated, isValid(cartSchema), updateCart);

// clear cart
// url should be different from the next endPoint we replaced them to solve conflict
router.patch("/clear", isAuthenticated, clearCart);

// remove product from cart
router.patch(
  "/:productId",
  isAuthenticated,
  isValid(removeProductFromCartSchema),
  removeProductFromCart
);

export default router;
