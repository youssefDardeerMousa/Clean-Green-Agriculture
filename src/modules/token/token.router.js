import { Router } from "express";
import { allTokens } from "./token.controller.js";

const router=Router()
router.get("/",allTokens)
export default router