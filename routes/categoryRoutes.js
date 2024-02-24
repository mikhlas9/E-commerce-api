const express = require("express")
const {addCategory, getCategory} = require("../controllers/categoryController")

const router = express.Router()

router.route("/category/add").post(addCategory)
router.route("/categories").get(getCategory)

module.exports = router