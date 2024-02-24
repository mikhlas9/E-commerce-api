const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler");

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const userId = req.user._id;

        const userInfo = await Cart.findOne({ user: userId });

        // Find the product by ID 
        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.availability < quantity) {
            return res.status(404).json({ message: `only ${product.availability} products avaliable` });
        }

        // Add the product to the user's cart
        let cartItem;

        if (!userInfo) {
            cartItem = await Cart.create({
                user: userId,
                products: [{ product: product._id, quantity: quantity }],
                total: product.price * quantity
            });
        } else {

            const existingProduct = userInfo.products.find(item => item.product.equals(productId));
            if (existingProduct) {
                cartItem = await Cart.findOneAndUpdate(
                    { user: userId, "products.product": productId }, // Filter the document by its ID
                    { $inc: { "products.$.quantity": quantity, total: product.price * quantity } },
                    { new: true }
                );
            } else {
                cartItem = await Cart.findOneAndUpdate(
                    { user: userId },
                    {
                        $push: {
                            products: [{ product: product._id, quantity: quantity }],
                        },
                        $inc: { total: product.price * quantity }
                    },
                    { new: true }
                );
            }

            product.availability -= quantity;
            await product.save();

            res.status(200).json({ success: true, message: "Product added to cart successfully", data: cartItem });
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ message: "Failed to add product to cart" });
    }
});

const viewCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        // Fetch the user's cart
        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'products.product',
                select: '-availability' // Exclude the 'availability' field
            });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // If the cart is found, return the cart data
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
});


const updateQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        // Find the product by ID to get its price
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find the user's cart and the product in the cart
        const cartProduct = await Cart.findOne({ user: userId, "products.product": productId });

        if (!cartProduct) {
            return res.status(404).json({ message: "Cart or product not found" });
        }

        // Find the product entry in the cart
        const productInCart = cartProduct.products.find(item => item.product.equals(productId));

        if (!productInCart) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const newPrice = product.price * quantity;                 // Calculate the new total based on the new quantity
        const oldTotal = cartProduct.total;                        // Calculate the old total of the cart
        const productTotal = productInCart.quantity * product.price;     // Calculate the old total of the particular product
        const newTotal = (oldTotal - productTotal) + newPrice



        // Calculate the difference between old and new quantities to update product availibility
        const oldQuantity = productInCart.quantity;
        const quantityDiff = quantity - oldQuantity;




        // Update the quantity of the product in the user's cart
        const cart = await Cart.findOneAndUpdate(
            { user: userId, "products.product": productId }, // Filter the cart by user ID and product ID
            { $set: { "products.$.quantity": quantity, total: newTotal } }, // Update the quantity of the matched product
            { new: true } // Return the updated document
        );

        if (!cart) {
            return res.status(404).json({ message: "Cart or product not found" });
        }

        // Adjust product availability
        product.availability -= quantityDiff;
        await product.save();

        res.status(200).json({ success: true, message: "Product quantity updated in cart", data: cart });
    } catch (error) {
        console.error("Error updating product quantity:", error);
        res.status(500).json({ message: "Failed to update product quantity in cart" });
    }
});


const removeItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const productId = req.body.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Filter out the product to be removed from the cart
        const removedProduct = cart.products.find(item => item.product.equals(productId));

        if (!removedProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const productPrice = product.price * removedProduct.quantity;     // Calculate the price of the particular product to be removed
        cart.total -= productPrice;                                       // Update the total price in the cart


        // Calculate the quanitity of the product to be removed
        const productQuantity = removedProduct.quantity;


        // Remove the product from the cart
        cart.products = cart.products.filter(item => !item.product.equals(productId));

        // Save the updated cart
        cart = await cart.save();


         // Adjust product availability
         product.availability += productQuantity;
         await product.save();


        res.status(200).json({ success: true, message: "Product removed from cart", data: cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: "Failed to remove product from cart" });
    }
});



module.exports = { addToCart, viewCart, updateQuantity, removeItem }