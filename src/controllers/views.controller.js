const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const Response = require("../utils/reusables.js");
const productModel = require("../models/product.model.js");
const response = new Response();


class ViewsController {

    async renderLogin(req, res) {
        if (req.session.login) {
            return res.redirect("/profile"); //con .redirect redirigimos a la ruta especificada
        }
        res.render("login");
    };

    async renderRegister(req, res) {
        if (req.session.login) {
            return res.redirect("/profile");
        }
        res.render("register");
    };

    async renderProfile(req, res) {
        const isAdmin = req.session.user.role === "admin"
        const user = req.session.user
        try {
            if (!req.session.login) {
                return res.redirect("/login")
            };
            res.render("profile", { user: user, isAdmin });
        } catch (error) {
            console.error("Error al obtener el usuario", error);
            response.responseError(res, 500, "Error al obtener el usuario");
        };
    };

    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
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

            const cartId = req.session.cart;

            res.render("products", {
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
            console.log("Error al obtener los productos", error);
            response.responseError(res, 500, "Error al obtener los productos")
        }
    }

    async renderCarts(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await cartRepository.getCartById(cartId);

            if (!cart) {
                console.log("No existe el carrito con el id ingresado");
                return response.responseError(res, 404, "El recurso solicitado no se pudo encontrar");
            };

            const productsInCart = cart.products.map(item => ({
                product: item.product.toObject(), //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. comen profe para no olvidarlo
                quantity: item.quantity
            }));

            res.render("carts", { products: productsInCart });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            response.responseError(res, 500, "Error al obtener el carrito");
        };
    };

    async renderIndex(req, res) {
        res.render("index");
    };

    async renderRealtimeproducts(req, res) {
        try {
            if (req.session.user.role !== "admin") {
                return response.responseMessage(res, 403, "Acceso denegado");
            }
            res.render("realtimeproducts");
        } catch (error) {
            response.responseError(res, 500, "Error interno del servidor");
        };
    };

    async renderChat(req, res) {
        try {
            if (req.session.user.role != "user") {
                return response.responseMessage(res, 403, "Acceso denegado");
            }
            res.render("chat");
        } catch (error) {
            response.responseError(res, 500, "Error interno del servidor");
        };
    };

    async admin(req, res) {
        if (req.session.user.role !== "admin") {
            return response.responseMessage(res, 403, "Acceso denegado");
        }
        res.render("admin", { user: req.session.user });
    }
};

module.exports = ViewsController;
