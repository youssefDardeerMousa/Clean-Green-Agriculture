import { Router } from "express";

import express from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { cancelOrder,AllOrder, createOrder, orderWebhook } from "./order.controller.js";
import { cancelOrderSchema, createOrderSchema } from "./order.validation.js";
const router = Router();

// create
router.post("/createOrder", isAuthenticated, isValid(createOrderSchema), createOrder);

// cancel
router.patch(
  "/:orderId",
  isAuthenticated,
  isValid(cancelOrderSchema),
  cancelOrder
);

// all orders
router.get("/",isAuthenticated,AllOrder)
// Webhook
// stripe will call this endpoint after the money is taken

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  orderWebhook
);

export default router;
