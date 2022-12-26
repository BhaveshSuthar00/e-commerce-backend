require('dotenv').config();
const express = require('express');

const cors = require('cors');

const port = process.env.PORT || 2200;

const app = express();

const connect = require('./conflig/db');

const userController = require('./controllers/user.controller');

const productController = require('./controllers/product.controller');

const cartController = require("./controllers/cart.controller");
const { authenticate } = require('./middlewares/authorization');
var corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1",
        "http://104.142.122.231",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
}

app.use(cors());
app.use(express.json());

function updateRequestMethod(req, res, next) {
    if (req.body.method) {
        req.method = req.body.method;
        return next();
    }
    return next();
}

app.use(updateRequestMethod);
// app.use('/product', cors(corsOptions), productController)
// app.use('/user', cors(corsOptions), userController)
// app.use('/cart', cors(corsOptions), authenticate, cartController)


app.use('/product', productController)
app.use('/user', userController)
app.use('/cart', authenticate, cartController)


app.listen(port, async ()=>{
    try {
        await connect();
        console.log(`listening to port ${port}`);
    } catch (err) {
        console.log(err.message);
    }
})
// {
        // app.use(cors({credentials : true, origin: 'http://localhost:3000'}));
        // app.set("trust proxy", 1);
        // app.use(
        //     session({
        //         secret: process.env.SESSION_SECRET || 'Super Secret (change it)',
        //         resave: true,
        //         saveUninitialized: false,
        //         cookie: {
        //             sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
        //             secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
        //         }
        //     })
        // );
        // app.use(cors({credentials: true, origin : process.env.FONTENDURL}))
        // app.use(express.urlencoded({ extended: true }));
        // app.use(cookieParser());
    // }