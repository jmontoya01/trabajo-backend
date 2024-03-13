const express = require("express");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");
const app = express();
const PUERTO = 8080;

//Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("./src/public"));

//handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


//socket.io
const hhtpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en puerto: ${PUERTO}`);
});

const io = socket(hhtpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");

    socket.emit("products", await productManager.getProducts());
    
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        io.socket.emit("products", await productManager.getProducts());
    });

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        io.sockets.emit("products", await productManager.getProducts());
    });
        
});



