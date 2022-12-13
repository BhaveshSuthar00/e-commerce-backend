const express = require("express");
const Product = require("../models/product.model");
const router = express.Router();

router.post("/post", async (req, res) => {
    try {
        console.log(req.body);
        const Products = await Product.create({
            productName: req.body.productName,
            price: req.body.price,
            discount: req.body.discount,
            category: req.body.category,
            subCategory: req.body.subCategory,
            image: req.body.image,
            stockQty: req.body.stockQty,
            description: req.body.description,
            fabric: req.body.fabric,
            brand: req.body.brand,
            color: req.body.color
        });
        return res.status(200).json({ message: "Product successfully created", product: Products });
    } catch (e) {
        console.log(e);
        return res.status(404).json({ message: e });
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || 8;
        let totalPages = Math.ceil((await Product.find().countDocuments()) / size);
        let Products;
        let sort = req.query.order === "asc" ? 1 : -1;
        if (req.query.order) {
            if (req.query.category && req.query.brand) {
                if (req.query.discount) {
                    let obj = { $and: [{ category: req.query.category }, { brand: req.query.brand }, { $gte: { discount : req.query.discount } }] };
                    totalPages = Math.ceil((await Product.find(obj).countDocuments()) / size);
                    Products = await Product.find(obj)
                        .skip((page - 1) * size)
                        .limit(size)
                        .sort({ price: sort })
                        .lean()
                        .exec();
                    return res.status(200).json({ product: Products, totalPages: totalPages });
                } else {
                    let obj = { $and: [{ category: req.query.category }, { brand: req.query.brand }] };
                    totalPages = Math.ceil((await Product.find(obj).countDocuments()) / size);
                    Products = await Product.find(obj)
                        .skip((page - 1) * size)
                        .limit(size)
                        .sort({ price: sort })
                        .lean()
                        .exec();
                    return res.status(200).json({ product: Products, totalPages: totalPages });
                }
            } else if (req.query.category) {
                if (req.query.discount) {
                    let obj = { $and: [{ category: req.query.category }, { $gte: { brand: req.query.brand } }] };
                    totalPages = Math.ceil((await Product.find(obj).countDocuments()) / size);
                    Products = await Product.find(obj)
                        .skip((page - 1) * size)
                        .limit(size)
                        .sort({ price: sort })
                        .lean()
                        .exec();
                    return res.status(200).json({ product: Products, totalPages: totalPages });
                } else {
                    let obj = { category: req.query.category };
                    totalPages = Math.ceil((await Product.find(obj).countDocuments()) / size);
                    Products = await Product.find(obj)
                        .skip((page - 1) * size)
                        .limit(size)
                        .sort({ price: sort })
                        .lean()
                        .exec();
                    return res.status(200).json({ product: Products, totalPages: totalPages });
                }
            }
        } else {
            if (req.query.category && req.query.brand && req.query.discount) {
                totalPages = Math.ceil(
                    (await Product.find({
                        $and: [{ brand: req.query.brand }, { category: req.query.category }, { $gte: { discount: req.query.dicount } }],
                    }).countDocuments()) / size
                );
                Products = await Product.find({
                    $and: [{ category: req.query.category }, { brand: req.query.brand }, { $gte: { discount: req.query.discount } }],
                })
                    .skip((page - 1) * size)
                    .limit(size)
                    .lean()
                    .exec();
                return res.status(200).json({ product: Products, totalPages: totalPages });
            }
            else if(req.query.brand && req.query.category) {
                totalPages = Math.ceil(
                    (await Product.find({ $and: [{ brand: req.query.brand }, { category: req.query.category }] }).countDocuments()) / size
                );
                Products = await Product.find({ $and: [{ category: req.query.category }, { brand: req.query.brand }] })
                    .skip((page - 1) * size)
                    .limit(size)
                    .lean()
                    .exec();
                return res.status(200).json({ product: Products, totalPages: totalPages });
            }
            else if (req.query.category && req.query.discount) {
                totalPages = Math.ceil(
                    (await Product.find({ $and: [{ brand: req.query.category }, { $gte: { discount: req.query.dicount } }] }).countDocuments()) /
                        size
                );
                Products = await Product.find({ $and: [{ category: req.query.category }, { $gte: { discount: req.query.discount } }] })
                    .skip((page - 1) * size)
                    .limit(size)
                    .lean()
                    .exec();
                return res.status(200).json({ product: Products, totalPages: totalPages });
            }
        }
        Products = await Product.find({ category: req.query.category })
            .skip((page - 1) * size)
            .limit(size)
            .lean()
            .exec();
        return res.status(200).json({ product: Products, totalPages: totalPages });
    } catch (e) {
        console.log(e);
        return res.status(404).json({ message: "Error getting all products" });
    }
});
router.get("/all", async (req, res) => {
    try {
        const data = await Product.find();
        return res.status(200).json(data);
    } catch (e) {
        throw new Error(e);
    }
});
router.get("/:id", async (req, res) => {
    try {
        const data = await Product.findById(req.params.id);
        return res.status(200).json(data);
    } catch (e) {
        throw new Error(e);
    }
});
module.exports = router;
