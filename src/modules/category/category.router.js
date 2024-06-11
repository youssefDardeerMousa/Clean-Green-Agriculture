import { Router } from "express";

import { UpdateCategorySchema, createCategorySchema,DeleteCategorySchema } from "./category.validation.js";
import { fileUpload, filterObject } from "../../../utils/multer.js";
import { createCategory,UpdateCategory,DeleteCategory,GetAllCategory, SearchCategory } from "./category.controller.js";
import subcategoryRouter from '../subcategory/subcategory.router.js'
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";

const router = Router();
router.use("/:categoryId/subcategory", subcategoryRouter)
// CRUD
router.post("/",isAuthenticated
,isAuthorized("admin")
,fileUpload(filterObject.image).single("category")
,isValid(createCategorySchema)
,createCategory)
// Update
router.patch("/:categoryId",isAuthenticated
,isAuthorized("admin")
,fileUpload(filterObject.image).single('category')
,isValid(UpdateCategorySchema)
,UpdateCategory)
router.delete("/:categoryId",isAuthenticated
,isAuthorized("admin")
,isValid(DeleteCategorySchema)
,DeleteCategory)
<<<<<<< HEAD
router.get('/',GetAllCategory)
router.get('/search',SearchCategory)
=======
router.get('/',isAuthenticated,GetAllCategory)
router.get('/search',isAuthenticated,SearchCategory)
>>>>>>> 1a5dd29f58388354726b79b9d3962c79f9ccacf4


export default router 