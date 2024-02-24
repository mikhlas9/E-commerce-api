const express = require("express")
const {addProduct, getProductListByCategory, getProductById, updateProduct } = require("../controllers/productController")

const router = express.Router()

router.route("/products/add").post(addProduct)
router.route("/products/category/:categoryId").get(getProductListByCategory)
router.route("/products/details/:productId").get(getProductById)
router.route("/products/update/:productId").put(updateProduct)


module.exports = router
