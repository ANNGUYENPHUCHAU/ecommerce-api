import prisma from "../config/prisma.js";

export async function createProduct(pname, price, quantity) {
    const product = await prisma.product.create({
        data: {
            pname: pname,
            price: price,
            quantity: quantity
        }
    });

    return product;
}

export async function getAllProducts() {
    return await prisma.product.findMany({
        orderBy: {
            pid: "asc"
        }
    });
}

export async function getProductById(pid) {
    return await prisma.product.findUnique({
        where: {
            pid: pid
        }
    });
}
export async function updateProduct(
    pid,
    pname,
    price,
    quantity
) {
    return await prisma.product.update({
        where: {
            pid: pid
        },
        data: {
            pname: pname,
            price: price,
            quantity: quantity
        }
    });
}

export async function deleteProduct(pid) {
    return await prisma.product.delete({
        where: {
            pid: pid
        }
    });
}