import React, { useContext } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Footer = () => {
  const { token, logout, navigate } = useContext(ShopContext)

  const handleScroll = () => window.scrollTo(0, 0);

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
            Imad Pets is your destination for quality pet products and accessories. We bring you carefully selected collections that combine quality, comfort, and style for your furry friends. Whether it's our latest arrivals or best-selling items, we make sure your shopping journey is simple, secure, and enjoyable.
          </p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <Link onClick={handleScroll} to={'/'}>Home</Link>
            <Link onClick={handleScroll} to={'/about'}>About us</Link>
            <Link onClick={handleScroll} to={'/privacy-policy'}>Privacy policy</Link>
            <div onClick={token ? logout : () => navigate('/login')} className='cursor-pointer'>
              {token ? 'Logout' : 'Login'}
            </div>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+212629400699</li>
            <li>sassianasdev@gmail.com</li>
          </ul>
        </div>
        <div>
          <hr />
          <p className='py-5 text-sm text-center'>
            Copyright {new Date().getFullYear()} © Imad Pets - All Right Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer