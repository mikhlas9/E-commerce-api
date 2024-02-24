const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availability: {
        type: Number, 
        default: 0,
    }

});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;