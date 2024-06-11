import { Router } from "express";
import { fileUpload, filterObject } from "../../../utils/multer.js";
import { SearchSubcategory, allSubCategories, createSubCategory, deleteSubCategory, singlesubcategory, updateSubCategory } from "./subcategory.controller.js";
import { SubCategorySchema, createSubCategorySchema, deleteSubCategorySchema, updateSubCategorySchema } from "./subcategory.validation.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";


const router = Router({ mergeParams: true });

// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).fields([
    { name: "Image", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  isValid(createSubCategorySchema),
  createSubCategory
);

// update
router.patch(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).fields([
    { name: "Image", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  isValid(updateSubCategorySchema),
  updateSubCategory
);

// delete
router.delete(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteSubCategorySchema),
  deleteSubCategory
);
//all subcategories from categories
<<<<<<< HEAD
router.get("/", allSubCategories)
// read SearchSubcategory

router.get("/search", SearchSubcategory)
router.get("/:subcategoryId",isValid(SubCategorySchema), singlesubcategory);
export default router;
=======
router.get("/",isAuthenticated, allSubCategories)
// read SearchSubcategory

router.get("/search",isAuthenticated, SearchSubcategory)
router.get("/:subcategoryId",isAuthenticated,isValid(SubCategorySchema), singlesubcategory);
export default router;
>>>>>>> 1a5dd29f58388354726b79b9d3962c79f9ccacf4
