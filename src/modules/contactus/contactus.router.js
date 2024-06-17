import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { contactusSchema } from "./contactus.validation.js";
import { contactus, getContactMessages } from "./contactus.controller.js";

const router = Router()
router.post("/",isAuthenticated,isValid(contactusSchema),contactus)
router.get("/",isAuthenticated,getContactMessages)
export default router
