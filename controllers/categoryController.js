const Category = require("../models/categoryModel")
const asyncHandler = require("express-async-handler");

const getCategory = asyncHandler(async (req, res) => {
    try {
        let allCategories = await Category.find({});

        res.status(200).json({ allCategories });
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ message: "Error fetching category" });
    }

});

const addCategory = asyncHandler(async (req, res) => {
    const { category} = req.body;
    
    try {
        let cat = await Category.findOne({category});

        if(cat){
            return res.status(409).json({ message: "Category already exists" });
        }
        
        const addCat = await Category.create({
            category,
        });

        // Send a success response with the newly added Category data
        res.status(201).json({ success: true, data: addCat });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Failed to add category" });
    }
});


module.exports = { getCategory, addCategory }