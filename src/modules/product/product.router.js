import { Router } from "express";

import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { fileUpload, filterObject } from "../../../utils/multer.js";
import { createProductSchema, productIdSchema } from "./product.validation.js";
import {
  SearchProduct,
  addProduct,
  allProducts,
  deleteProduct,
  singleProduct,
  updateProduct
} from "./product.controller.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";

 
// mergeParams to use categoryId when get products of category
// const router = Router({ mergeParams: true });
 const router = Router();

// CRUD

// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  isValid(createProductSchema),
  addProduct
);
// delete
router.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(productIdSchema),
  deleteProduct
);

//Update 
router.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  isValid(createProductSchema),
  updateProduct
);

// All Product
router.get("/",isAuthenticated, allProducts);

// single product
router.get("/:productId",isAuthenticated, isValid(productIdSchema), singleProduct);
// search for product
router.get("/search",isAuthenticated, SearchProduct);

// read all products of certain category SearchProduct

export default router