const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager();
const cartModel = require("../models/cart.model.js");
const productModel = require("../models/product.model.js");
const response = require("../utils/reusables.js");

//create new cart
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito", error);
        response(res, 500, "Error interno del servidor")
        // res.status(500).json({ error: "Error interno del servidor" })
    }
});

//We list the products that belong to a certain cart.
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            console.log("No encontramos el carrito con el id");
            return response(res, 404, " El recurso solicitado no se pudo encontrar.")
            // return res.status(404).json({ error: " El recurso solicitado no se pudo encontrar." })
        }
        return res.json(cart.products)
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        response(res, 500, "Error interno del servidor")
        // res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Add products to different carts.
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const cart = await cartModel.findOne({ _id: cartId });
        const product = await productModel.findOne({ _id: productId });
        if (!cart) {
            return response(res, 404, "Carrito no encontrado" );
            // return res.status(404).json({ message: "Carrito no encontrado" });
        };
        if (!product) {
            return response(res, 404, "Producto no encontrado" );
            // return res.status(404).json({ message: "Producto no encontrado" });
        }
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar productos al carrito", error);
        response(res, 500, "Error interno del servidor");
        // res.status(500).json({ error: "Error interno del servidor" });
    }
});

//delete product of the cart by id
router.delete("/:cid/product/:pid", async (req, res) => {

    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartModel.findOne({ _id: cartId });
        const product = await productModel.findOne({ _id: productId });
        if (!cart) {
            return response(res, 404, "Carrito no encontrado");
            // return res.status(404).json({ message: "Carrito no encontrado" });
        };
        if (!product) {
            return response(res, 404, "Producto no encontrado");
            // return res.status(404).json({ message: "Producto no encontrado" });
        }
        const updateCart = await cartManager.deleteProductFromCart(cartId, productId);//voy acá
        res.json({ status: "succes", message: "Producto Eliminado del carrito", updateCart });
    } catch (error) {
        console.error("Error al agregar un producto al carrito", error);
        response(res, 500, "Error interno del servidor");
        // res.status(500).json({ error: "Error interno del servidor" });
    };
});

//update products cart
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const updateProduct = req.body;

    try {
        const cart = await cartModel.findOne({ _id: cartId });
        if (!cart) {
            return response(res, 404, "Carrito no encontrado");
            // return res.status(404).json({ message: "Carrito no encontrado" });
        };
        const updateCart = await cartManager.updateCart(cartId, updateProduct);
        res.json(updateCart);
    } catch (error) {
        response(res, 500, "Error interno del servidor", error);
        // res.status(500).json({ error: "Error interno del servidor" }, error);
    };
});

//update quantity product
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const cart = await cartModel.findOne({ _id: cartId });
        const product = await productModel.findOne({ _id: productId });
        if (!cart) {
            return response(res, 404, "Carrito no encontrado");
            // return res.status(404).json({ message: "Carrito no encontrado" });
        };
        if (!product) {
            return response(res, 404, "Producto no encontrado");
            // return res.status(404).json({ message: "Producto no encontrado" });
        }

        const updateCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
        res.json({ status: "sucess", message: "Cantidad del producto actualizada correctamente", updateCart });

    } catch (error) {
        response(res, 500, "Error interno del servidor", error)
        // res.status(500).json({ error: "Error interno del servidor" }, error);
    };
});

//empty(vaciar) the cart
router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findOne({ _id: cartId });
        if (!cart) {
            return response(res, 404, "Carrito no encontrado");
            // return res.status(404).json({ message: "Carrito no encontrado" });
        };
        const updateCart = cartManager.emptyCart(cartId);
        res.json({ status: "sucess", message: "Carrito eliminado con éxito!", updateCart })
    } catch (error) {
        response(res, 500, "Error interno del servidor", error)
        // res.status(500).json({ error: "Error interno del servidor" }, error);
    }

})

module.exports = router;