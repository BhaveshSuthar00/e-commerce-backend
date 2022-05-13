const express = require('express');
const Product = require('../models/product.model');
const router = express.Router();

router.post('/post', async(req, res)=>{
    try {
        await Product.create(req.body);
        return res.status(200).json({message: 'Success added the product'});
    }
    catch (e) {
        return res.status(404).json({message : e.message});
    }
})
router.get('/getAll', async(req, res) => {
    try {
        const Products = await Product.find().lean().exec();
        return res.status(200).json(Products);
    }
    catch (e) {
        return res.status(404).json({message: 'Error getting all products'})
    }
})
module.exports = router;