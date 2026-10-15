import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useTranslation } from '../context/LanguageContext'

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <div>
      {/* Header */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={t('privacy.privacyPolicy').split(' ')[0]} text2={t('privacy.privacyPolicy').split(' ')[1]} />
      </div>

      {/* Main section */}
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.privacy_img} alt="Privacy Policy" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p dangerouslySetInnerHTML={{ __html: t('privacy.p1') }} />
          <p>{t('privacy.p2')}</p>
          <b className='text-gray-800'>{t('privacy.collectTitle')}</b>
          <p>{t('privacy.collectText')}</p>
        </div>
      </div>

      {/* WHY WE COLLECT Section */}
      <div className='text-xl py-4'>
        <Title text1={t('privacy.whyWeCollect').split(' ')[0]} text2={t('privacy.whyWeCollect').split(' ')[1]} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>{t('privacy.improveTitle')}</b>
          <p className='text-gray-600'>{t('privacy.improveText')}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>{t('privacy.processTitle')}</b>
          <p className='text-gray-600'>{t('privacy.processText')}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>{t('privacy.securityTitle')}</b>
          <p className='text-gray-600'>{t('privacy.securityText')}</p>
        </div>
      </div>

      {/* Data Protection Section */}
      <div className='text-xl py-4'>
        <Title text1={t('privacy.dataProtection').split(' ')[0]} text2={t('privacy.dataProtection').split(' ')[1]} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>{t('privacy.storedText')}</p>
          <p>{t('privacy.encryptionText')}</p>
          <b className='text-gray-800'>{t('privacy.yourRights')}</b>
          <p dangerouslySetInnerHTML={{ __html: t('privacy.rightsText') }} />
        </div>
        <img className='w-full md:max-w-[450px]' src={assets.contact_img} alt="Data Protection" />
      </div>

      {/* Contact Info */}
      <div className='text-center text-gray-600 mb-20'>
        <p>{t('privacy.questions')}</p>
        <p className='mt-2'>{t('privacy.email')}</p>
        <p>{t('privacy.phone')}</p>
        <p>{t('privacy.address')}</p>
      </div>



    </div>
  )
}

export default PrivacyPolicy
