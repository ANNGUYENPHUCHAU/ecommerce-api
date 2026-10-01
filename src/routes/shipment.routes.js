import express from "express";

import {
    create,
    getByOrder,
    updateStatus
} from "../controllers/shipment.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", create);
router.get("/order/:oid", getByOrder);
router.put("/:id", updateStatus);

export default router;