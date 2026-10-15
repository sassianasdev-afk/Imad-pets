import express from 'express';
import { loginUser, registerUser, logoutUser, adminLogin, adminLogout } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

// user routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout-user', logoutUser)
userRouter.post('/verify-user', authUser, (req, res) => {
    res.json({ success: true })
})

// admin routes
userRouter.post('/admin', adminLogin)
userRouter.post('/logout', adminLogout)
userRouter.get('/verify-admin', adminAuth, (req, res) => {
    res.json({ success: true })
})

export default userRouter;