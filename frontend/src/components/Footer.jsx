import React, { useContext } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { useTranslation } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useTranslation();
  const { token, logout, navigate } = useContext(ShopContext)

  const handleScroll = () => window.scrollTo(0, 0);

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>{t('footer.desc')}</p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>{t('footer.company')}</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <Link onClick={handleScroll} to={'/'}>{t('footer.home')}</Link>
            <Link onClick={handleScroll} to={'/about'}>{t('footer.aboutUs')}</Link>
            <Link onClick={handleScroll} to={'/privacy-policy'}>{t('footer.privacyPolicy')}</Link>
            <div onClick={token ? logout : () => navigate('/login')} className='cursor-pointer'>
              {token ? t('footer.logout') : t('footer.login')}
            </div>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>{t('footer.getInTouch')}</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>0675175682</li>
            <li>imadsbai530@gmail.com</li>
          </ul>
        </div>
        <div>
          <hr />
          <p className='py-5 text-sm text-center'>
            {t('common.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
