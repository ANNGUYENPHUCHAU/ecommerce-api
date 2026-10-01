import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/profile",
    authenticateToken,
    (req, res) => {
        return res.status(200).json({
            message: "Protected route accessed successfully",
            user: req.user
        });
    }
);

export default router;