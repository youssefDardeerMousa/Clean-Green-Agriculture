import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlist.controller.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { addToWishlistValidation, removeFromWishlistValidation } from "./wishlist.validation.js";

const router = Router();

router.post("/add", isAuthenticated,isValid(addToWishlistValidation), addToWishlist);
router.patch("/remove", isAuthenticated,isValid(removeFromWishlistValidation),removeFromWishlist);
router.get("/", isAuthenticated, getWishlist);

export default router;
//wishlist