import express from 'express'
import cookieParser from 'cookie-parser'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import dns from 'node:dns/promises'
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    next()
})

const allowedOrigins = [
    process.env.ADMIN_URL ,
    process.env.FRONTEND_URL,
].filter(Boolean)

app.use((req, res, next) => {
    const origin = req.headers.origin

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, token')
    
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
})

app.use(express.json())
app.use(cookieParser())

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))