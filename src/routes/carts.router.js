const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager();
const CartModel = require("../models/cart.model.js");
const cartModel = require("../models/cart.model.js");

//create new cart
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" })
    }
});

//We list the products that belong to a certain cart.
router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            console.log("No encontramos el carrito con el id");
            return res.status(404).json({error: " El recurso solicitado no se pudo encontrar."})
        }
        return res.json(cart.products)
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Add products to different carts.
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProducToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar productos al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//delete product of the cart by id
router.delete("/:cid/product/:pid", async (req, res) => {

    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updateCart = await cartManager.deleteProductToCart(cartId, productId);//voy acá
        res.json({ status: "succes", message: "Producto Eliminado del carrito", updateCart});
    } catch (error) {
        console.error("Error al agregar un producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    };
});

//update products cart
router.put("/cid", async (req, res) => {
    const cartId = req.params.cid;
    const updateProduct = req.body;

    try {
const updateCart = await cartManager.updateCart(cartId, updateProduct);
res.json(updateCart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" }, error);
    };
});

//update quantity product
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
    
        const updateCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
        res.json({status: "sucess", message: "Cantidad del producto actualizada correctamente", updateCart});

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" }, error);
    };
});

//empty(vaciar) the cart
router.delete("/cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updateCart = cartManager.emptyCart(cartId);

        res.json({status: "sucess", message: "Carrito eliminado con éxito!", updateCart})
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" }, error);
    }

})

module.exports = router;