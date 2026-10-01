import prisma from "../config/prisma.js";

export async function createOrder(uid, items) {
    return await prisma.$transaction(async(tx) => {
        const productIds = items.map((item) => item.pid);

        const products = await tx.product.findMany({
            where: {
                pid: { in: productIds
                }
            }
        });

        if (products.length !== productIds.length) {
            const error = new Error("One or more products not found");
            error.statusCode = 404;
            throw error;
        }

        const orderDetails = items.map((item) => {
            const product = products.find(
                (p) => p.pid === item.pid
            );

            return {
                pid: item.pid,
                qty: item.qty,
                unit_price: product.price
            };
        });

        const order = await tx.order.create({
            data: {
                uid: uid,

                orderDetails: {
                    create: orderDetails
                }
            },

            include: {
                orderDetails: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return order;
    });
}

export async function getOrdersByUser(uid) {
    return await prisma.order.findMany({
        where: {
            uid: uid
        },

        include: {
            orderDetails: {
                include: {
                    product: true
                }
            }
        },

        orderBy: {
            oid: "asc"
        }
    });
}

export async function getOrderById(uid, oid) {
    return await prisma.order.findFirst({
        where: {
            oid: oid,
            uid: uid
        },

        include: {
            orderDetails: {
                include: {
                    product: true
                }
            }
        }
    });
}