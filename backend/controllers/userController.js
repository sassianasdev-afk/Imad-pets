import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import { blacklistToken } from "../middleware/Tokenblacklist.js"

const createToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    ) //  7 days
}

const setUserCookie = (res, token) => {
    res.cookie('userToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 , //  7 days
    })
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) return res.json({ success: false, message: "User doesn't exists" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            setUserCookie(res, createToken(user._id))
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await userModel.findOne({ email });
        if (exist) return res.json({ success: false, message: 'User already exists' })

        if (!validator.isEmail(email)) return res.json({ success: false, message: 'Please enter a valid email' })
        if (password.length < 8) return res.json({ success: false, message: 'Please enter a strong password' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()

        setUserCookie(res, createToken(user._id))
        res.json({ success: true })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.userToken
        if (token) {
            //  نبلاكليستيو الـ token باش مايبقاش صالح حتى لو تسرب
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                blacklistToken(token, decoded.exp * 1000) // exp بالـ seconds → ms
            } catch (_) { /* token already expired — مشكلاش */ }
        }
        res.clearCookie('userToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict'
        })
        res.json({ success: true, message: "Logged out successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        
        
        const isEmail = await email === process.env.ADMIN_EMAIL
        // const isEmail = await bcrypt.compare(email, process.env.ADMIN_EMAIL)  MORE SECURE
        if (!isEmail) return res.json({ success: false, message: "Invalid credentials" })
            
        const isMatch = await password === process.env.ADMIN_PASSWORD
        // const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD)  MORE SECURE
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" })

        const token = jwt.sign(
            { key: process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD },
            process.env.JWT_SECRET,
            { expiresIn: '1d', algorithm: 'HS256' }
        );

        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
            maxAge: 24 * 60 * 60 * 1000 ,
        });

        return res.json({ success: true })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const adminLogout = async (req, res) => {
    try {
        const token = req.cookies?.adminToken
        if (token) {
            //  نبلاكليستيو الـ token باش مايبقاش صالح حتى لو تسرب
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                blacklistToken(token, decoded.exp * 1000) // exp بالـ seconds → ms
            } catch (_) { /* token already expired — مشكلاش */ }
        }
        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict'
        });
        res.json({ success: true, message: "Logged out successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, logoutUser, adminLogin, adminLogout }