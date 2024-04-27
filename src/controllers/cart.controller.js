const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const Response = require("../utils/reusables.js")
const response = new Response();

class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartRepository.createCart();
            console.log("Carrito creado correctamente");
            return res.json(newCart);
        } catch (error) {
            console.error("Error al crear el carrito", error);
            response.responseError(res, 500, "Error interno del servidor");
        };
    };

    async getCartById(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartById(cartId);
            if (!cart) {
                console.log("No encontramos el carrito con el id");
                return response.responseError(res, 404, " El recurso solicitado no se pudo encontrar.")
            }
            console.log("carrito encontrado con éxito");
            return res.json(cart.products)
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            response.responseError(res, 500, "Error al obtener el carrito");
        };
    };

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            const productInCart = await cartRepository.addProductToCart(cartId, productId, quantity);
            // const cartID = (req.user.cart).toString();//fede no entiendo porque el profe puso esto, me puedes explicar de donde salio el req.user,cart?
            // res.redirect(`/carts${cartID}`);
            console.log("Producto agregado al carrito correctamente");
            res.json(productInCart)
        } catch (error) {
            console.error("Error al agregar productos al carrito", error);
            response.responseError(res, 500, "Error al agregar productos al carrito");
        };
    };

    async deleteProductFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updateCart = await cartRepository.deleteProductFromCart(cartId, productId);
            console.log("Producto eliminado del carrito con éxito");
            res.json(updateCart);
        } catch (error) {
            console.error("Error al agregar un producto al carrito", error);
            response.responseError(res, 500, "Error al agregar un producto al carrito");
        };
    };

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updateProducts = req.body;

        try {

            const updateCart = await cartRepository.updateProductsInCart(cartId, updateProducts);
            console.log("Producto actualizado con éxito");
            res.json(updateCart);
        } catch (error) {
            console.log("Error al actualizar los productos", error);
            response.responseError(res, 500, "Error al actualizar los productos");
        };
    };

    async updateProductQuantity(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const newQuantity = req.body.quantity;

            const updateCart = await cartRepository.updateProductQuantity(cartId, productId, newQuantity);
            console.log("Cantidad del producto actualizada correctamente");
            res.json(updateCart);
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto");
            response.responseError(res, 500, "Error al actualizar la cantidad del producto", error)
        };
    };

    async emptyCart(req, res) {
        try {
            const cartId = req.params.cid;
            const updateCart = cartRepository.emptyCart(cartId);
            console.log("Carrito eliminado con éxito!");
            res.json(updateCart);
        } catch (error) {
            console.log("Error al vaciar el carrito");
            response.responseError(res, 500, "Error al vaciar el carrito", error);
        };
    };

};

module.exports = CartController;