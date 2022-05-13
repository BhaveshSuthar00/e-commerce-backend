require('dotenv').config();
const express = require('express');

const cors = require('cors');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = process.env.PORT || 2200;

const app = express();

const connect = require('./conflig/db');

const userController = require('./controllers/user.controller');

const productController = require('./controllers/product.controller');

const { authenticate } = require('./middlewares/authorization');

// app.use(cors({credentials : true, origin: 'http://localhost:3000'}));
app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'Super Secret (change it)',
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
            secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
        }
    })
);
app.use(cors({credentials: true, origin : process.env.FONTENDURL}))
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
function updateRequestMethod(req, res, next) {
    if (req.body.method) {
        req.method = req.body.method;
        return next();
    }
    return next();
}

app.use(updateRequestMethod);
// app.use('/', async (req, res)=>{
//     return res.status(200).send({message: 'Success'})
// })
app.use('/user', userController)
app.use('/product', productController)
app.use('/clearcookie', authenticate, async(req,res)=> {
    try {
        res.clearCookie('token')
        res.status(200).json({ message: "sign out success" });
    }
    catch (err) {
        return res.status(500).send({ message: "sign out error" });
    }
})

app.listen(port, async ()=>{
    try {
        await connect();
        console.log(`listening to port ${port}`);
    } catch (err) {
        console.log(err.message);
    }
})