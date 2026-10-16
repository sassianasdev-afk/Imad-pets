import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useTranslation } from '../context/LanguageContext'

const Contact = () => {
  const { t } = useTranslation();
  return (
    <div>

    <div className='text-center text-2xl pt-10 border-t'>
      <Title text1={t('contact.contactUs')} text2={t('contact.us')} />
    </div>
    <div className='my-10 flex flex-col  md:flex-row gap-10 mb-28'>
      <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
      <div className='flex flex-col justify-center items-start gap-6'>
        <p className='font-semibold text-xl text-gray-600'>{t('contact.ourStore')}</p>
        <p className='text-gray-500'>Meknes , Hamria</p>
        <p className='text-gray-500'>Tel: (212)675175682 <br /> Email: imadsbai530@gmail.com</p>
        <p className='font-semibold text-xl text-gray-600'>{t('contact.careers')}</p>
        <p className='text-gray-500'>{t('contact.careersDesc')}</p>
        <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>{t('contact.exploreJobs')}</button>
      </div>

    </div>
<NewsletterBox 
  top={t('newsletter.needHelp')}
  midle={t('newsletter.contactUs')}
  bottom={t('newsletter.hereForYou')}
/>


    </div>
  )
}

export default Contact