const productModel = require("../models/product.model.js");

class ProductManager {

    async addProduct({ title, description, price, code, stock, category, thumbnails }) {

        try {
            
            const newProduct = new productModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    


    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            };

            const sortOptions = {};
            if (sort) {
                if (sort === "asc" || sort === "desc") {
                    sortOptions.price = sort === "asc" ? 1 : -1;
                };
            };

            const products = await productModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await productModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    };

    async getProductById(id) {
        try {
            const product = await productModel.findById(id)

            if (!product) {
                console.log("Producto no encontrado");
                return null;
            };

            console.log("Producto encontrado con éxito!");
            return product;
        } catch (error) {
            console.log("error al buscar el producto por id", error);
        }
    };

    async updateProduct(id, productUpdate) {
        try {
            const updated = await productModel.findByIdAndUpdate(id, productUpdate);
            if (!updated) {
                console.log("No se encontro el produdcto");
                return null;
            };

            console.log("Producto actualizado con éxito!");
            return updated;
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        };
    };

    async deleteProduct(id) {
        try {
            const deleted = await productModel.findByIdAndDelete(id);

            if (!deleted) {
                console.log("No se encuentra el producto con el id");
                return null;
            }

            console.log("Producto eliminado con éxito!");
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        };
    };

};

module.exports = ProductManager;