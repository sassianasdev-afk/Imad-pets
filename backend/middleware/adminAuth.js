import jwt from 'jsonwebtoken'
import { isBlacklisted } from './Tokenblacklist.js'

const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.adminToken

        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }

        //  نتحققو واش token مبلاكليستي (logout دار بيه)
        if (isBlacklisted(token)) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

        if (token_decode.key !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }

        next()

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth