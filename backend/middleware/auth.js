import jwt from 'jsonwebtoken'
import { isBlacklisted } from './Tokenblacklist.js'

const authUser = async (req, res, next) => {
    const token = req.cookies?.userToken

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    //  نتحققو واش token مبلاكليستي (logout دار بيه)
    if (isBlacklisted(token)) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser