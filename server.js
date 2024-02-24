const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./config/db")

const userRoutes = require("./routes/userRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const productRoutes = require("./routes/productRoutes")

PORT = process.env.PORT || 5000

dotenv.config();

connectDB();

const app = express();

app.use(express.json())


app.get("/", (req,res)=> {
    res.send("hello")
})

app.use("/", userRoutes)
app.use("/", categoryRoutes)
app.use("/", cartRoutes)
app.use("/", orderRoutes)
app.use("/", productRoutes)

app.listen(PORT, (req,res) => {
    console.log("server running at port 5000");
})