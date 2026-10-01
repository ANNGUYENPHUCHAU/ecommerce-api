import {
    createOrder,
    getOrdersByUser,
    getOrderById
} from "../services/order.service.js";

export async function create(req, res) {
    try {
        const uid = req.user.uid;
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "items are required"
            });
        }

        const productIds = new Set();

        for (const item of items) {
            if (!Number.isInteger(item.pid) ||
                item.pid <= 0 ||
                !Number.isInteger(item.qty) ||
                item.qty <= 0
            ) {
                return res.status(400).json({
                    message: "Each item must have valid pid and qty"
                });
            }

            if (productIds.has(item.pid)) {
                return res.status(400).json({
                    message: "Duplicate product in order"
                });
            }

            productIds.add(item.pid);
        }

        const order = await createOrder(
            uid,
            items
        );

        return res.status(201).json({
            message: "Order created successfully",
            order: order
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function getAll(req, res) {
    try {
        const uid = req.user.uid;

        const orders = await getOrdersByUser(uid);

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function getById(req, res) {
    try {
        const uid = req.user.uid;
        const oid = Number(req.params.id);

        if (!Number.isInteger(oid) || oid <= 0) {
            return res.status(400).json({
                message: "Invalid order id"
            });
        }

        const order = await getOrderById(
            uid,
            oid
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}