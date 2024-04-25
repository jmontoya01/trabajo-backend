const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const configObject = require("./config/config.js")
const {port} = configObject;
require("./database.js");

//Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(cors());
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
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

const hhtpServer = app.listen(port, () => {
    console.log(`Escuchando en puerto: ${port}`);
});

const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(hhtpServer);





