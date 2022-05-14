const express = require('express');
const Product = require('../models/product.model');
const router = express.Router();

router.post('/post', async(req, res)=>{
    try {
        const Products = await Product.create({
            productName : req.body.productName,
            price : req.body.price,
            discount : req.body.discount,
            category : req.body.category,
            subCategory : req.body.subCategory,
            image : req.body.image,
            stockQty : req.body.stockQty,
            description : req.body.description,
            fabric : req.body.fabric,
            brand : req.body.brand,
            color : req.body.color,
            id : req.body.id
        });
        return res.status(200).json({message: 'Product successfully created', product : Products});
    }
    catch (e) {
        console.log(e)
        return res.status(404).json({message : e});
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