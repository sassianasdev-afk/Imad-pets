import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router";
import axios from 'axios';

export const ShopContext = createContext();

// كل request كيبعت cookies أوتوماتيك
axios.defaults.withCredentials = true

const ShopContextProvider = (props) => {

    const currency = 'MAD :';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [menu, setMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true) //  باش ما يديرش logout عند refresh
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size })
                toast.success(`${cartData[itemId][size]} item(s) added to cart`)
            } catch (error) {
                toast.error(error.message)
            }
        } else {
            cartData[itemId] = {}
            toast.error('Please login to add items to cart')
            navigate('/login');
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) totalCount += cartItems[items][item];
                } catch (error) { }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData)
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity })
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) totalAmount += itemInfo.price * cartItems[items][item]
                } catch (error) { }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const getUserCart = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {})
            if (response.data.success) setCartItems(response.data.cartData)
        } catch (error) {
            console.log(error)
        }
    }

    // logout — كيكلي backend يمحي cookie
    const logout = async () => {
        try {
            await axios.post(backendUrl + '/api/user/logout-user')
        } catch (error) {
            console.log(error)
        } finally {
            setToken(false)
            setCartItems({})
            navigate('/login')
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    //  عند بداية التطبيق كنتحققو من الـ session — checkingAuth باش ما يديرش logout عند refresh
    useEffect(() => {
        const verifySession = async () => {
            try {
                // ShopContext.jsx — بدل get بـ post
                const res = await axios.post(backendUrl + '/api/user/verify-user', {})
                if (res.data.success) {
                    setToken(true)
                    getUserCart()
                } else {
                    setToken(false)
                }
            } catch {
                setToken(false)
            } finally {
                setCheckingAuth(false) //  كيكمل، سواء logged in أو لا
            }
        }
        verifySession()
    }, [])

    // auto-logout كل 5 دقائق
    useEffect(() => {
        if (!token) return
        const interval = setInterval(async () => {
            try {
                const res = await axios.post(backendUrl + '/api/user/verify-user', {})
                if (!res.data.success) {
                    setToken(false)
                    setCartItems({})
                    toast.info('Session expired. Please login again.')
                    navigate('/login')
                }
            } catch {
                setToken(false)
                setCartItems({})
                toast.info('Session expired. Please login again.')
                navigate('/login')
            }
        }, 10 * 1000)
        return () => clearInterval(interval)
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, getProductsData,
        menu, setMenu, loading, logout, checkingAuth
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;