import {
    createShipment,
    getShipmentsByOrder,
    updateShipmentStatus
} from "../services/shipment.service.js";

export async function create(req, res) {
    try {
        const uid = req.user.uid;
        const { oid, status } = req.body;

        if (!Number.isInteger(oid) ||
            oid <= 0 ||
            !status
        ) {
            return res.status(400).json({
                message: "Valid oid and status are required"
            });
        }

        const shipment = await createShipment(
            uid,
            oid,
            status
        );

        return res.status(201).json({
            message: "Shipment created successfully",
            shipment: shipment
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function getByOrder(req, res) {
    try {
        const uid = req.user.uid;
        const oid = Number(req.params.oid);

        if (!Number.isInteger(oid) || oid <= 0) {
            return res.status(400).json({
                message: "Invalid order id"
            });
        }

        const shipments = await getShipmentsByOrder(
            uid,
            oid
        );

        return res.status(200).json(shipments);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function updateStatus(req, res) {
    try {
        const uid = req.user.uid;
        const shipid = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(shipid) ||
            shipid <= 0
        ) {
            return res.status(400).json({
                message: "Invalid shipment id"
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "status is required"
            });
        }

        const shipment = await updateShipmentStatus(
            uid,
            shipid,
            status
        );

        return res.status(200).json({
            message: "Shipment updated successfully",
            shipment: shipment
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
}