const socket = require("socket.io");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const messageModel = require("../models/messages.model.js");


class SocketManager {
    constructor(hhtpServer){
        this.io = socket(hhtpServer);
        this.initSocketEvents()
    };

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conecto");
        
            socket.emit("products", await productRepository.getProducts());
        
            socket.on("messages", async data => {
                await messageModel.create(data)
                const messages = await messageModel.find()
                socket.emit("messages", messages)
            })
        
            socket.on("deleteProduct", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });
        
            socket.on("addProduct", async (product) => {
                await productRepository.addProduct(product);
                this.emitUpdatedProducts(socket);
            });
        });
    };

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productRepository.getProducts());
    }
};

module.exports = SocketManager;

