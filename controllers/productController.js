const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler");

const getProductListByCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        // Retrieve products based on category ID
        const products = await Product.find({ category: categoryId }).populate('category');
        
        if(products.length === 0){
            return res.status(404).json({ message: "No products of specified Category" });
        }

        const productDetails = products.map(product => ({
            _id: product._id,
            category: product.category.category,
            title: product.title,
            description: product.description,
            price: product.price,
            availability: product.availability
        }));
    
        res.status(200).json({ success: true, data: productDetails });
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Failed to retrieve products" });
    }

});

const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.productId; // Extract the product ID from request parameters

    try {
        // Retrieve product based on product ID
        const product = await Product.findById(productId).populate('category');
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Extract essential details for the product
        const productDetails = {
            _id: product._id,
            category: product.category.category, 
            title: product.title,
            description: product.description,
            price: product.price,
            availability: product.availability
        };
    
        res.status(200).json({ success: true, data: productDetails });
    } catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).json({ message: "Failed to retrieve product" });
    }
});


const addProduct = asyncHandler(async (req, res) => {
    const { categoryId, title, description, price, availability} = req.body;
    
    try {
        if (!title || !price || !description || !availability || !categoryId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const product  = await Product.create({
            category: categoryId, 
            title,
            price,
            description,
            availability,
        });

        // Send a success response with the newly added Category data
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Failed to add category" });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const { price, availability } = req.body; // Assuming both price and availability may be provided for update

    try {
        let updateFields = {};
        
        // Check if price is provided and add it to the updateFields object
        if (price !== undefined) {
            updateFields.price = price;
        }

        // Check if availability is provided and add it to the updateFields object
        if (availability !== undefined) {
            updateFields.availability = availability;
        }

        // Find the product by ID and update the specified fields
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateFields,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
});



module.exports = { getProductListByCategory, addProduct, getProductById, updateProduct }