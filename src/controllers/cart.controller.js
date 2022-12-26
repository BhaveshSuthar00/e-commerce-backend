const express = require("express");
const Cart = require('../models/cart.model');
const router = express.Router();


router.post('/post', async (req, res) => {
    try {

        const userId = req.user._id;

        const findUser =  await Cart.findOne({ userId : userId}).lean().exec();

        if(findUser){

            findUser.productId.push(req.body.productId);

            const pr = await Cart.findOneAndReplace({ userId : userId}, findUser, {new : true});

            return res.status(200).json(pr);
        }
        const create = await Cart.create({ userId : userId, productId : [ req.body.productId ] });

        return res.status(200).json(create);
    }
    catch (err) {
        return res.status(404).send(err);
    }
})

router.get("", async (req, res) => {
    try {
        const userId = req.user._id;
        const updateUserCart = await Cart.findOne({ userId : userId}).populate({path : 'productId'}).lean().exec();
        return res.status(200).json(updateUserCart);
    }
    catch (err) {
        return res.status(500).json(err);
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Cart.updateOne({userId : req.user._id}, {$pull : {productId : productId}}, { new : true}).lean().exec();
        return res.status(200).json(product)
    }
    catch (err) {
        return res.status(500).json(err);
    }
})
module.exports = router;