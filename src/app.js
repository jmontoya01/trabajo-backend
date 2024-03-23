const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js");
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const app = express();
const PUERTO = 8080;
require("./database.js");

//Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session ({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,

    store: MongoStore.create({
        mongoUrl:"mongodb+srv://jeffquetas:jeff1302@cluster0.zqiftye.mongodb.net/proyecto-backend?retryWrites=true&w=majority",
        ttl: 100//ttl: expires basado en ttl y se encarga de limpiar autamaticamente una vez q pase el tiempo de expires
    })
}));

//passport..
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);


//listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en puerto: ${PUERTO}`);
});



