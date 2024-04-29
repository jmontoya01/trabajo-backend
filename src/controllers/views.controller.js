const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const Response = require("../utils/reusables.js")
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
        if (!req.session.login) {
            return res.redirect("/login")
        };
        // res.render("profile", { user: req.session.user });
        try {
            const { page = 1, limit = 2 } = req.query;
            const products = await productRepository.getProducts({
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const newArray = products.docs.map(product => {
                const { _id, ...rest } = product.toObject();
                return rest;
            });


            res.render("profile", {
                user: req.session.user,
                products: newArray,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages
            });

        } catch (error) {
            console.error("Error al obtener los productos", error);
            response.responseError(res, 500, "Error al obtener los productos");
        };
    };

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
        try {
            const products = await productRepository.getProducts();
            const newArray = products.docs.map(product => {
                const { _id, ...rest } = product.toObject();
                return rest;
            });
            res.render("index", {
                user: req.session.user,
                products: newArray, 
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages
            });
        } catch (error) {
            response.responseError(res, 500, "Error interno del servidor");
        };
    };

    async renderRealtimeproducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            response.responseError(res, 500, "Error interno del servidor");
        };
    };

    async renderChat(req, res) {
        try {
            res.render("chat");
        } catch (error) {
            response.responseError(res, 500, "Error interno del servidor");
        };
    };
};

module.exports = ViewsController;
