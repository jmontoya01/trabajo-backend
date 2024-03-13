const { error, clear } = require("console");

const fs = require("fs").promises;


class ProductManager {
    static ultiId = 0

    constructor(path) {
        this.products = [];
        this.path = path
    };

    async addProduct(newObject) {

        let { title, description, price, img, code, stock } = newObject;

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son hobligatorios para continuar ");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("El codigo tiene que ser unico");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultiId,
            title,
            description,
            price,
            img,
            code,
            stock,
            category
        }

        this.products.push(newProduct);

        await this.saveFile(this.products);

    };

    getProducts() {
        try {
            const arrayProducts = this.readFile();
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    };

    async getProductById(id) {
        try {
            const arrayProducts = await this.readFile();
            const search = arrayProducts.find(item => item.id == id);//search(buscar)
            
            if (!search) {
                console.log("Producto no encontrado");
            } else {
                return search;
            }
        } catch {
            console.log("error al leer el archivo", error);
        }
    };

    async readFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8")
            const arrayProducts = JSON.parse(response)
            return arrayProducts

        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    };

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));

        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    };


    async updateProduct(id, productUpdate) {
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id)
            if (index !== -1) {
                arrayProducts.splice(index, 1, productUpdate);
                await this.saveFile(arrayProducts);
            } else {
                console.log("No se encontro el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    };

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProducts.splice(index, 1);
                await this.saveFile(arrayProducts);
            } else {
                console.log("No se encontro el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error)
        }
    };

};

module.exports = ProductManager;