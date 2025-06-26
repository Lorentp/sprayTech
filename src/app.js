const express = require('express');
const app = express();
require("./database.js")

//ENV
const dotenv = require("dotenv")
dotenv.config()

const port = process.env.PORT
const mongo_url = process.env.MONGO_URL

//Middlewares
const multer = require("multer");
const upload = multer(); // Configuración básica de multer
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(upload.none()); // Para manejar multipart/form-data sin archivos
app.use(express.static("./src/public"));
app.use(require("method-override")("_method"));

//Handlebars
const expressHandlebars = require("express-handlebars")
const hbs = expressHandlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault : true,
        allowProtoMethodsByDefault: true,
    }, 
    helpers: {
        range: function(start, end) {
    let range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
    },
    json: function (context) {
      return JSON.stringify(context);
    },
    formatDate: function (date) {
      if (!date) return "";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    }
})




app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", "./src/views")


// Sessions
const session = require("express-session")
const MongoStore = require("connect-mongo")
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongo_url, ttl:14*24*60*60 }),
    cookie: {
        maxAge: 14*24*60*60
    }
}));


//Routes
const viewsRouter = require("./router/views.router.js")
const userRouter = require("./router/user.router.js")
const sessionRouter = require("./router/session.router.js")
const fieldsRouter = require("./router/fields.router.js")
const productsRouter = require("./router/products.router.js")
const recipesRouter = require("./router/recipes.router.js")
app.use("/", viewsRouter)
app.use("/register", userRouter)
app.use("/login", sessionRouter)
app.use("/fields", fieldsRouter)
app.use("/products", productsRouter)
app.use("/recipes", recipesRouter)

const httpServer = app.listen(port, () => {
    console.log(`Servidor testeando en el puerto ${port}`)
})