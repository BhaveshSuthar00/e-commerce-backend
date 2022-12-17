const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId : [{type : mongoose.Schema.Types.ObjectId, ref : "product", required : true},],
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'user', required : true},
},{
    versionKey : false,
})

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;