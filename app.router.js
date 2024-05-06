import dotenv from 'dotenv'

import authRouter from './src/modules/user/user.router.js'
import categoryRouter from './src/modules/category/category.router.js'
import subcategoryRouter from './src/modules/subcategory/subcategory.router.js'
import morgan from 'morgan'
import cors from 'cors'
import productRouter from './src/modules/product/product.router.js'
import CartRouter from './src/modules/cart/cart.router.js'
import CouponRouter from './src/modules/coupon/coupon.router.js'
import OrderRouter from './src/modules/order/order.router.js'
import bestsellerRouter from "./src/modules/bestseller/bestseller.router.js"
import tokenRouter from "./src/modules/token/token.router.js"
dotenv.config()

export const appRouter=(app,express)=>{
    //Global MiddleWare
app.use(express.json());
app.use(morgan("dev"));
app.use(cors())
//Router
//authentication
app.use("/auth",authRouter)
// Category Router
app.use("/category",categoryRouter)
//subcategory
app.use("/subcategory",subcategoryRouter)
//  Product
app.use("/product",productRouter)

// cart
app.use("/cart",CartRouter)
// coupon
app.use("/coupon",CouponRouter)
// order  
app.use("/order",OrderRouter)
// best seller
app.use("/bestseller",bestsellerRouter)
//Token
app.use("/token",tokenRouter)
// Base Url
app.get("/",(req,res,next)=>{
    const temp = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clean and Green Agriculture</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<style>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #eaf4f4;
    text-align: center;
}

.welcome-message {
    margin-top: 100px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 48px;
    color: #2c5234;
}

p {
    color: #336e47;
    font-size: 24px;
    margin: 20px 0;
}

.plant-icons {
    margin-top: 40px;
}

.plant-icons i {
    font-size: 64px;
    margin: 0 20px;
    color: #3d9970;
    border-radius: 50%;
    padding: 20px;
    background-color: #d2f1de;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.plant-icons i:hover {
    transform: scale(1.1);
}

</style>
    </head>
<body>
    <div class="welcome-message">
        <h1>Welcome to Clean and Green Agriculture!</h1>
        <p>Discover a world of beautiful plants, trees, and seeds for your sustainable garden.</p>
        <div class="plant-icons">
            <i class="fas fa-tree"></i>
            <i class="fas fa-seedling"></i>
            <i class="fas fa-leaf"></i>
        </div>
    </div>
</body>
</html>
`
    res.status(200).header('Content-Type', 'text/html').send(temp);
})

const Port=process.env.port
app.listen(Port,()=>{
    console.log(`Server Is Running On Port ${Port}`);
})
//Not Found Page Router
app.all("*",(req, res, next)=>{
    return next(new Error("Not Found Page ! ",{causs:404}))
})
// Global Error Handler
app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    const errorResponse = {
        success: false,
        status: statusCode,
        message: error.message,
        stack: error.stack
    };

    if (process.env.NODE_ENV !== 'production') {
        // Include the error stack trace only in non-production environments
        errorResponse.stack = error.stack;
    }

    return res.status(statusCode).json(errorResponse);
});


}