const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName : { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    image: [{ type: String, required: true }],
    stockQty: { type: Number, required: true, default: 10 },
    description: { type: String, required: false },
    fabric : {type : String, required : true, default : "cotton"},
    brand : {type : String, required : true},
    color : [{type : String , required : true}]
  },
  {
    versionKey: false,   
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
