const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    },
    owner: {
        type: String,
        required: true,
        default: 'admin'
    }
});
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model("products", productSchema);

module.exports = productModel;

