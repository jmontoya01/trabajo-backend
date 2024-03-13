const fs = require("fs").promises

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;
        this.loadCarts();
    };

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error al cargar los carritos", error);
            await this.saveCarts();
        }
    };

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));        
    };

    async createCarts() {
        const newCart = {
            id: ++this.ultId,
            products: []
        }

        this.carts.push(newCart);

        await this.saveCarts();
        return newCart;
    };

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);
            if (!cart){
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error(`Error al buscar el carrito con el Id ${cartId}`);
            throw error;
        }
    };

    async addProductCart(cartId, productId, quantity = 1 ) {
        const cart = await this.getCartById(cartId)
        const productExists = cart.products.find(p => p.product === productId);

        if (productExists) {
            productExists.quantity += quantity;
        } else {
            cart.products.push({product: productId, quantity});
        }

        await this.saveCarts();
        return cart;
    };
};

module.exports = CartManager
