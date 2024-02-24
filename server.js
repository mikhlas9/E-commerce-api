const express = require("express")
const dotenv = require("dotenv");
const cors = require("cors")
const connectDB = require("./config/db")

const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

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
app.use(cors())


app.get("/", (req,res)=> {
    res.send("hello")
})




// Define options for swagger-jsdoc
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'E-Commerce API',
        version: '1.0.0',
        description: 'Documentation for the E-Commerce API',
      },
      servers:[
        {
            url: "http://localhost:5000/",
            description: "Local development server",
        },
        {
            url: "https://e-commerce-api-73le.onrender.com",
            description: "Production server"
        }
      ]
    },
    // Path to the YAML or JSON file containing the Swagger documentation
    apis: ['./swagger.yaml'],
  };
  
  // Initialize swagger-jsdoc
  const swaggerSpec = swaggerJSDoc(options);
  
  // Serve Swagger UI at /api-docs endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  




app.use("/", userRoutes)
app.use("/", categoryRoutes)
app.use("/", cartRoutes)
app.use("/", orderRoutes)
app.use("/", productRoutes)

app.listen(PORT, (req,res) => {
    console.log("server running at port 5000");
})