const Order = require("../models/orderModel")
const Cart = require("../models/cartModel")
const asyncHandler = require("express-async-handler");

const orderPlacement = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    
    try {
        // Retrieve the user's cart
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        
        if (!cart || !cart.products.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Create the order object
        const order = new Order({
            user: userId,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: cart.total
        });

        // Save the order
        await order.save();

        // Clear the user's cart
        await Cart.findOneAndUpdate({ user: userId }, { products: [], total: 0 });

        res.status(201).json({ success: true, message: "Order placed successfully", data: order });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Failed to place order" });
    }
});

const orderHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    
    try {
        // Retrieve the order history for the user
        const orders = await Order.find({ user: userId }).populate({
            path: 'products.product',
            select: '-availability' // Exclude the 'availability' field
        });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ message: "Failed to fetch order history" });
    }
});



const orderDetails = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId; 
    
    try {
        // Retrieve the order details by its ID
        const order = await Order.findById(orderId).populate({
            path: 'products.product',
            select: '-availability' // Exclude the 'availability' field
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ message: "Failed to fetch order details" });
    }
});



module.exports = {orderPlacement, orderHistory, orderDetails }