const cartModel = require("../models/cart.model.js");
const productModel = require("../models/product.model.js");
const TicketModel = require("../models/ticket.model.js");
const userModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");
const { sendPurchaseEMail } = require("../utils/email.js");
const CustomError = require("../utils/errors/custom-error.js");
const { errorCartId } = require("../utils/errors/info.js");
const { Errors } = require("../utils/errors/enums.js");
const logger = require("../utils/logger.js");


class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartRepository.createCart();
            logger.info("Carrito creado correctamente");
            return res.status(200).json(newCart);
        } catch (error) {
            logger.error("Error al crear el carrito", error);
            res.status(500).send({message: "Error al crear el carrito"});
        };
    };

    async getCartById(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartById(cartId);
            if (!cart) {
                throw CustomError.createError({
                    name: "ID Inválido de carrito",
                    cause: errorCartId(cartId),
                    message: "El ID del carrito enviado no es correcto",
                    code: Errors.ERROR_CART_ID
                });
            }
            logger.info("carrito encontrado con éxito");
            return res.status(200).json(cart.products)
        } catch (error) {
            logger.error("Error al obtener el carrito", error);
            res.status(500).send({message: "Error al obtener el carrito"});
        };
    };

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        const userEmail = req.session.user.email;

        try {
            const cart = await cartModel.findOne({ _id: cartId })
            const product = await productModel.findOne({ _id: productId })
            if (!cart) {
                return res.status(404).send({message: "Carrito no encontrado"});
            }
            if (!product) {
                return res.status(404).send({message: "Producto no encontrado"});
            }
            
            const user = await userModel.findOne({email: userEmail});
            if(user.role === 'premium'){
                const product = await productRepository.getProductById(productId);

                if (product.owner === user.email) {
                    return res.status(403).send({error: "No puedes agregar un producto que tú mismo creaste"});
                }
            }
            await cartRepository.addProductToCart(cart, product, quantity);
            const cartID = (req.session.user.cart).toString();
            res.redirect(`/carts/${cartID}`);
            logger.info("Producto agregado al carrito correctamente");
            return res.status(200)
        } catch (error) {
            logger.error("Error al agregar productos al carrito", error);
            res.status(500).send({message: "Error al agregar productos al carrito"});
        };
    };

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updateCart = await cartRepository.deleteProductFromCart(cartId, productId);
            logger.info("Producto eliminado del carrito con éxito");
            res.status(200).json(updateCart);
        } catch (error) {
            logger.error("Error al eliminar un producto del carrito", error);
            res.status(500).send({message: "Error al eliminar un producto del carrito"});
        };
    };

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updateProducts = req.body;

        try {
            const cart = await cartModel.findOne({ _id: cartId })
            if (!cart) {
                return res.status(404).send({message: "Carrito no encontrado"});
            }
            const updateCart = await cartRepository.updateProductsInCart(cart, updateProducts);
            logger.info("Producto actualizado con éxito");
            res.status(200).json(updateCart)
        } catch (error) {
            logger.error("Error al actualizar los productos", error);
            res.status(500).send({message: "Error al actualizar los productos"});
        };
    };

    async updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const cart = await cartModel.findOne({ _id: cartId })
            const product = await productModel.findOne({ _id: productId })
            if (!cart) {
                logger.warning("Carrito no encontrado");
                return res.status(404).send({message: "Carrito no encontrado"});
            }
            if (!product) {
                logger.warning("Producto no encontrado");
                return res.status(404).send({message: "Producto no encontradoo"});
            }

            const updateCart = await cartRepository.updateProductQuantity(cart, product, newQuantity);
            logger.info("Cantidad del producto actualizada correctamente");
            res.json(updateCart);
        } catch (error) {
            logger.error("Error al actualizar la cantidad del producto", error);
            res.status(500).send({message: "Error al actualizar la cantidad del producto"});
        };
    };

    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartModel.findOne({ _id: cartId })
            if (!cart) {
                logger.warning("Carrito no encontrado");
                return res.status(404).send({message: "Carrito no encontrado"});
            }
            const updateCart = cartRepository.emptyCart(cart);
            logger.info("Carrito eliminado con éxito!");
            res.json(updateCart);
        } catch (error) {
            logger.error("Error al vaciar el carrito", error);
            res.status(500).send({message: "Error al vaciar el carrito"});
        };
    };

    async Checkout(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartById(cartId)//optener carrito y sus productos
            const products = cart.products;

            const unavailableProducts = []; // arreglo para productos no disponibles

            for (const item of products) {//verificamos stock y actualizamos los productos disponibles
                const productId = item.product;
                const product = await productRepository.getProductById(productId);
                if (product.stock >= item.quantity) {//si hay suficiente stock restamos la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {// si no hay suficiente stock, agregamos el id del producto al arregle unavailableProducts
                    unavailableProducts.push(productId)
                }
            }

            const userCart = await userModel.findOne({ cart: cartId });//buscamos el carrito con el id del usuario
            const ticket = new TicketModel({//creamos un ticket con los datos de la compra
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => unavailableProducts.some(productId => productId.equals(item.product)));//elinamos del carrito los productos que sí se compraron
            await cart.save();//guardamos el carrito actualizado en la base de datos

            await sendPurchaseEMail(userCart.email, userCart.first_name, ticket._id);

            res.redirect(`/checkout/${ticket._id}`);

        } catch (error) {
            logger.error("Error al finalizar la compra", error);
            res.status(500).send({message: "Error al procesar la compra"});
        }
    }

};

module.exports = CartController;