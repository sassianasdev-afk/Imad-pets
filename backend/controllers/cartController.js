import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js"

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        
        const product = await productModel.findById(itemId)
        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            })
        }

        
        if (!product.sizes.includes(size)) {
            return res.json({
                success: false,
                message: "Size not available"
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        let cartData = userData.cartData || {}

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Added to Cart" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// updatecart user cart
const updatecart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body

    const userData = await userModel.findById(userId)
    if (!userData) {
      return res.json({ success: false, message: "User not found" })
    }

    let cartData = userData.cartData || {}

    // product ما كاينش
    if (!cartData[itemId]) {
      return res.json({ success: false, message: "Product not in cart" })
    }

    // size ما كاينش
    if (!cartData[itemId][size]) {
      return res.json({ success: false, message: "Size not in cart" })
    }

    /* ================= CORE LOGIC ================= */

    if (quantity <= 0) {
      // حيد size
      delete cartData[itemId][size]
    } else {
      // update quantity
      cartData[itemId][size] = quantity
    }

    // ila ما بقا حتى size ف داك product → حيد product كامل
    if (Object.keys(cartData[itemId]).length === 0) {
      delete cartData[itemId]
    }

    await userModel.findByIdAndUpdate(userId, { cartData })

    res.json({ success: true, message: "Cart Updated" })

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// get user cart
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({success:true , cartData});

    } catch (error) {
        
        res.json({success:false,message:error.message})
    }

    
}

export { addToCart, updatecart, getUserCart}
