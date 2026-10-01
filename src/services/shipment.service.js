import prisma from "../config/prisma.js";

export async function createShipment(uid, oid, status) {
    const order = await prisma.order.findFirst({
        where: {
            oid: oid,
            uid: uid
        }
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.shipment.create({
        data: {
            oid: oid,
            status: status
        }
    });
}

export async function getShipmentsByOrder(uid, oid) {
    const order = await prisma.order.findFirst({
        where: {
            oid: oid,
            uid: uid
        }
    });

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.shipment.findMany({
        where: {
            oid: oid
        },
        orderBy: {
            shipid: "asc"
        }
    });
}

export async function updateShipmentStatus(
    uid,
    shipid,
    status
) {
    const shipment = await prisma.shipment.findFirst({
        where: {
            shipid: shipid,
            order: {
                uid: uid
            }
        }
    });

    if (!shipment) {
        const error = new Error("Shipment not found");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.shipment.update({
        where: {
            shipid: shipid
        },
        data: {
            status: status
        }
    });
}