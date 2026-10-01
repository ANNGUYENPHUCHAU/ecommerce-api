import express from "express";

import {
    create,
    getAll,
    getById
} from "../controllers/order.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);

export default router;