const cartModel = require("../models/cart.model.js");
const logger = require("../utils/logger.js");

class CartRepository {
    async createCart() {
        try {
            const newCart = new cartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            logger.error("Error al crear el nuevo carrito de compras", error);
        };
    };

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                logger.warning("No se encontro el carrito con el id")
                return null;
            }
            return cart;
        } catch (error) {
            logger.error("Error al traer el carrito con el id", error);
        };
    };

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const existProduct = cart.products.findIndex(item => item.product.equals(productId));//En muchos lenguajes de programación, el método equals() se usa para comparar dos objetos para verificar si son iguales en términos de sus contenidos.
            // const existProduct = cart.products.find(item => item.product._id === productId)

            if (existProduct >= 0) {
                cart.products[existProduct].quantity += quantity;
                // existProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity })
            }

            cart.markModified("products");//marcamos la propiedad products como modificada antes de guardar
            await cart.save();
            return cart;

        } catch (error) {
            logger.error("Error al agregar un producto", error);
        };
    };

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return logger.warning("Carrito no econtrado");
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);//metodo filter comparamos los valores para que solo incluya aquellos productos cuyo _id no coincide con el productId 
            await cart.save();
            return cart;
        } catch (error) {
            logger.error("Error al eliminar el producto del carrito", error);
        };
    };

    async updateProductsInCart(cartId, updateProducts) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return logger.error("Carrito no encontrado");
            }

            cart.products = updateProducts;
            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            logger.error("Error al actualizar el carrito", error);
        };
    };

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return logger.error("Carrito no encontrado");
            }

            const productIndex = cart.products.findIndex(item => item.product.equals(productId));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                cart.markModified("products");
                await cart.save();
                return cart
            } else {
                logger.error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            logger.error("Error al actualizar la cantidad del producto en el carrito", error);
        };
    };

    async emptyCart(cartId) {//empty: vacear
        try {
            const cart = await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
            if (!cart) {
                return logger.error("No existe un carrito con ese id")
            };
            return cart;
        } catch (error) {
            logger.error("Error al vaciar el carrito en el gestor", error);
        };
    };
};

module.exports = CartRepository;