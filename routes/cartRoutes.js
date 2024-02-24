const express = require("express")
const {addToCart, viewCart, updateQuantity, removeItem } = require("../controllers/cartController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/cart/add").post(protect, addToCart)
router.route("/cart/view").get(protect, viewCart)
router.route("/cart/update").put(protect, updateQuantity)
router.route("/cart/remove").delete(protect, removeItem)


module.exports = router