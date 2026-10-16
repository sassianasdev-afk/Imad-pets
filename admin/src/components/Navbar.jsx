import React from 'react'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useTranslation } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import {Link} from 'react-router-dom'
const Navbar = ({ setIsLoggedIn }) => {
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      //  كنكلي الـ backend باش يمحي الـ cookie
      await axios.post(backendUrl + '/api/user/logout')
      setIsLoggedIn(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <Link to={'/'} className='w-[max(10%,80px)] cursor-pointer'>
        <img src={assets.logo} alt='' />
      </Link>
      <LanguageSwitcher />
      <button
        onClick={handleLogout}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>
        {t('nav.logout')}
      </button>
    </div>
  )
}

export default Navbar