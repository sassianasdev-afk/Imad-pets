import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import { ToastContainer, toast } from 'react-toastify';
import Update from './pages/Update'
import axios from 'axios'
import { assets } from './assets/admin_assets/assets'
import { useTranslation } from './context/LanguageContext'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'MAD :'

//  كل request كيبعت cookies أوتوماتيك
axios.defaults.withCredentials = true

const App = () => {
  const { t } = useTranslation();

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  //  عند بداية التطبيق كنتحققو من الـ session عبر cookie
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/user/verify-admin')
        setIsLoggedIn(res.data.success)
      } catch {
        setIsLoggedIn(false)
      } finally {
        setCheckingAuth(false)
      }
    }
    verifySession()
  }, [])

  //  auto-logout — كل دقيقة كيتحقق واش الـ cookie مزال صالح
  // إيلا expired الـ token (15min) كيرجع success:false وكيدير logout أوتوماتيك
  useEffect(() => {
    if (!isLoggedIn) return

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(backendUrl + '/api/user/verify-admin')
        if (!res.data.success) {
          setIsLoggedIn(false)
          toast.info(t('admin.sessionExpired'))
        }
      } catch {
        setIsLoggedIn(false)
        toast.info('Session expired. Please login again.')
      }
    }, 10 * 1000) // كل دقيقة

    return () => clearInterval(interval)
  }, [isLoggedIn])

  if (checkingAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <img src={assets.logo} className='flex justify-between w-1/2 items-center animate-pulse' alt="" />
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {
        !isLoggedIn
          ? <Login setIsLoggedIn={setIsLoggedIn} />
          :
          <>
            <Navbar setIsLoggedIn={setIsLoggedIn} />
            <hr />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                <Routes>
                  {/*  ما كنمرروش token — cookie كتمشي أوتوماتيك مع كل request */}
                  <Route path='/add' element={<Add />} />
                  <Route path='/list' element={<List />} />
                  <Route path='/orders' element={<Orders />} />
                  <Route path='/update/:id' element={<Update />} />
                </Routes>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default App