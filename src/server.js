const express = require('express');

const cors = require('cors');

const port = process.env.PORT || 2200;

const app = express();

const connect = require('./conflig/db');

const userController = require('./controllers/user.controller');
const { authenticate } = require('./middlewares/authorization');

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

function updateRequestMethod(req, res, next) {
    if (req.body.method) {
        req.method = req.body.method;
        return next();
    }
    return next();
}

app.use(updateRequestMethod);
app.use('/', async (req, res)=>{
    return res.status(200).send({message: 'Success'})
})
app.use('/user', userController)

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