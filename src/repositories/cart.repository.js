const cartModel = require("../models/cart.model.js");

class CartRepository {
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
            if (!cart) {
                console.log("No se encontro el carrito con el id")
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error al traer el carrito con el id", error);
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
            console.log("Error al agregar un producto", error);
            throw new Error("Error al agregar un producto");
        };
    };

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);//metodo filter comparamos los valores para que solo incluya aquellos productos cuyo _id no coincide con el productId 
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            throw new Error("Error al eliminar el producto del carrito");
        };
    };

    async updateProductsInCart(cartId, updateProducts) {
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
            throw new Error("Error al actualizar el carrito");
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
            throw new Error("Error al actualizar la cantidad del producto en el carrito");
        };
    };

    async emptyCart(cartId) {//empty: vacear
        try {
            const cart = await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
            if (!cart) {
                throw new Error("Carrito no encontrado con el id")
            };
            return cart;
        } catch (error) {
            console.error("Error al vaciar el carrito en el gestor", error);
            throw new Error("Error");
        };
    };
};

module.exports = CartRepository;