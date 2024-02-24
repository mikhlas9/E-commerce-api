const express = require("express")
const {orderPlacement, orderHistory, orderDetails } = require("../controllers/orderController")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/orders/place").post(protect, orderPlacement)
router.route("/orders/history").get(protect, orderHistory)
router.route("/orders/details/:orderId").get(protect, orderDetails)


module.exports = router