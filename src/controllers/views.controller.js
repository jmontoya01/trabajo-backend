const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const productModel = require("../models/product.model.js");
const userDTO = require("../dto/user.dto.js");
const cartModel = require("../models/cart.model.js");
const generate = require("../utils/faker.js");
const logger = require("../utils/logger.js");



class ViewsController {

    async renderLogin(req, res) {
        if (req.session.login) {
            return res.redirect("/"); //con .redirect redirigimos a la ruta especificada
        }
        res.render("login");
    };

    async renderRegister(req, res) {
        res.render("register");
    };

    async renderProfile(req, res) {

        const isAdmin = req.session.role === "admin"
        const isPremium = req.session.role === "premium"
        const userDto = new userDTO(req.session.user.first_name, req.session.user.last_name, req.session.user.email, req.session.user.role, req.session.user)
        try {
            if (!req.session.login) {
                return res.redirect("/login")
            };
            res.render("profile", { user: userDto, isAdmin, isPremium});
        } catch (error) {
            logger.error("Error al obtener el usuario", error);
            res.status(500).send({message: "Error al obtener el usuario "});
        };
    };

    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const skip = (page - 1) * limit;
            const products = await productModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await productModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const newArray = products.map(product => {
                const { _id, ...rest } = product.toObject();
                return { id: _id, ...rest };
            });

            const cartId = req.session.user.cart;

            res.render("products", {
                user: req.session.user,
                products: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            })

        } catch (error) {
            logger.error("Error al obtener los productos", error);
            res.status(500).send({message: "Error al obtener los productos "});
        }
    }

    async renderCarts(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await cartRepository.getCartById(cartId);

            if (!cart) {
                logger.warning("No existe el carrito con el id ingresado");
                return resstatus(404).send({message: "El recurso solicitado no se pudo encontrar"});
            };

            let totalPurchase = 0;

            const productsInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                totalPurchase += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });
            res.render("carts", { products: productsInCart, totalPurchase, cartId, user: req.session.user });
        } catch (error) {
            logger.error("Error al obtener el carrito", error);
            res.status(500).send({message: "Error al obtener el carrito "});
        };
    };

    async renderIndex(req, res) {
        res.render("index", { user: req.session.user });
    };

    async renderRealtimeproducts(req, res) {
        const user = req.session.user
        try {
            res.render("realtimeproducts", {user: user, first_name: user.first_name, role: user.role, email: user.email});
        } catch (error) {
            logger.error("Error al obtener la ruta", error);
            res.status(500).send({message: "Error al intentar renderizar la ruta "});
        };
    };

    async renderChat(req, res) {
        try {
            res.render("chat");
        } catch (error) {
            logger.error("Error al obtener el chat", error);
            res.status(500).send({message: "Error al tratar de renderizar el chat "});
        };
    };

    async admin(req, res) {
        const isAdmin = req.session.role === "admin"
        const isPremium = req.session.role === 'premium';
        res.render("admin", { user: req.session.user}, isAdmin, isPremium );
    }

    async checkout(req, res) {
        const numTicket = req.params.coid;
        const cart = await cartModel.findOne({ _id: req.session.user.cart });
        res.render("checkout", {
            client: req.session.user.first_name,
            email: req.session.user.email,
            numTicket,
            cart,
            user: req.session.user
        });
    }

    async mockingproducts(req, res) {
        const products = [];

        for (let i = 0; i < 100; i++) {
            products.push(generate.generateProducts());

        }
        res.render("mockingproducts", { products: products, user: req.session.user });
    };

    async testLogger(req, res) {
        logger.fatal("Error fatal");
        logger.error("Mensaje de error");
        logger.warning("Mensaje de warning");
        logger.info("Mensaje de información");
        logger.http("mensaje de http");
        logger.debug("mensaje de debug");

        res.send("Test de logs");
    }

    async failregister(req, res) {
        res.render("failregister");
    };

    async renderResetPassword(req, res) {
        res.render("resetpassword");
    };

    async confirmationmail(req, res) {
        res.render("confirmationmail");
    };

    async changePassword(req, res) {
        res.render("changePassword");
    }

};

module.exports = ViewsController;
