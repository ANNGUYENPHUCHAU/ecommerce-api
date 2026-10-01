import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../services/product.service.js";

export async function create(req, res) {
    try {
        const { pname, price, quantity } = req.body;

        if (!pname || price === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "pname, price and quantity are required"
            });
        }

        if (Number(price) < 0 || Number(quantity) < 0) {
            return res.status(400).json({
                message: "price and quantity must not be negative"
            });
        }

        const product = await createProduct(
            pname,
            Number(price),
            Number(quantity)
        );

        return res.status(201).json({
            message: "Product created successfully",
            product: product
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function getAll(req, res) {
    try {
        const products = await getAllProducts();

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function getById(req, res) {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const product = await getProductById(pid);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}
export async function update(req, res) {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const existingProduct = await getProductById(pid);

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const { pname, price, quantity } = req.body;

        if (!pname || price === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "pname, price and quantity are required"
            });
        }

        if (Number(price) < 0 || Number(quantity) < 0) {
            return res.status(400).json({
                message: "price and quantity must not be negative"
            });
        }

        const product = await updateProduct(
            pid,
            pname,
            Number(price),
            Number(quantity)
        );

        return res.status(200).json({
            message: "Product updated successfully",
            product: product
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}

export async function remove(req, res) {
    try {
        const pid = Number(req.params.id);

        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        const existingProduct = await getProductById(pid);

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await deleteProduct(pid);

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error"
        });
    }
}