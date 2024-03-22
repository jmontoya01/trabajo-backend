const cartModel = require("../models/cart.model.js");

class CartManager {

    async createCart() {
        try {
            const newCart = new cartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el nuevo carrito de compras", error);
        };
    };

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            !cart ? console.log("No existe ese carrito con el id") : cart;
        } catch (error) {
            console.log("Error al traer el carrito con el id", error);
        };
    };

    async addProducToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const existProduct = cart.products.find(item => item.product.toString() === productId);

            existProduct ? existProduct.quantity += quantity : cart.products.push({ product: productId, quantity });
            cart.markModified("products");//marcamos la propiedad products como modificada antes de guardar
            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error al agregar un producto", error);
        };
    };

    async deleteProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            throw error;
        };
    };

    async updateCart(cartId, updateProducts) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado")
            }

            cart.products = updateProducts;
            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            throw error;
        };

    };

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified("products");

                await cart.save();
                return cart
            } else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
            throw error;
        };
    };

    async emptyCart(cartId) {//empty: vacear
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                {products: []},
                {new: true}
            );

            if (!cart) {
                throw new Error("Carrito no encontrado con el id")
            };
            return cart;

        } catch (error) {
            console.error("Error al vaciar el carrito en el gestor", error);
            throw error;
        };
    };
};



module.exports = CartManager
