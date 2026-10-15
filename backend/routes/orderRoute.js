import express from 'express'
import {placeOrder,placeOrderRazorpay,placeOrderStripe,placeOrderRIB,allOrders,userOrders,updateStatus, verifyStripe, deleteOrder} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
orderRouter.post('/delete',adminAuth,deleteOrder)

// payment features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)
orderRouter.post('/rib',authUser,placeOrderRIB)

//verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

// user feature
orderRouter.post('/userorders',authUser,userOrders)

export default orderRouter