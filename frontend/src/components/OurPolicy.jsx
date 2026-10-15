import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { useTranslation } from '../context/LanguageContext'

const OurPolicy = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>{t('ourPolicy.easyExchange')}</p>
            <p className='text0white'>{t('ourPolicy.easyExchangeDesc')}</p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>{t('ourPolicy.daysReturn')}</p>
            <p className='text0white'>{t('ourPolicy.daysReturnDesc')}</p>
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>{t('ourPolicy.bestSupport')}</p>
            <p className='text0white'>{t('ourPolicy.bestSupportDesc')}</p>
        </div>

    </div>
  )
}

export default OurPolicy