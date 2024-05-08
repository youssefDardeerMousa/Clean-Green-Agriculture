import { Router } from "express";
import { activateSchema, forgetCodeSchema, loginSchema, registerSchema, resetPasswordSchema,roleSchema } from "./user.validation.js";
import { activationAccount, login,deleteaccount, register, resetPassword, sendForgetCode,RoleUser,allusers,logout } from "./user.controller.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { CatchError } from "../../../utils/catch_error.js";
import { isValid } from "../../middleware/validation.middleware.js";

const router=Router();
//Register
router.post("/register",isValid(registerSchema),CatchError(register))
//Activate Account
router.get("/confirmEmail/:activationCode",isValid(activateSchema),CatchError(activationAccount))
//Login
router.post("/login",isValid(loginSchema),CatchError(login))
// send forget password Code 
router.patch("/forgetpasswordcode",isValid(forgetCodeSchema),CatchError(sendForgetCode))
//Reset Password
router.patch("/resetpassword",isValid(resetPasswordSchema),CatchError(resetPassword))
// Admin or User
router.patch("/role",isValid(roleSchema),CatchError(RoleUser))
//Gat All User
router.get("/users",isAuthenticated,CatchError(allusers))
// Log Out
router.delete("/logout",isAuthenticated,CatchError(logout))
router.delete("/deleteAccount",isAuthenticated,deleteaccount)

export default router