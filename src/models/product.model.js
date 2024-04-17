const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock:{
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    thumbnails: {
        type: [String]
    }
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;

