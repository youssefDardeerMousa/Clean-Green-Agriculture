import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";

import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { AllBestSeller, bestselleradd } from "./bestseller.controller.js";
import { bestsellerschema } from "./bestseller.validation.js";

const router = Router()

router.post("/:id",isAuthenticated,isAuthorized("admin"),isValid(bestsellerschema),bestselleradd)
router.get("/",isAuthenticated,AllBestSeller)
export default router