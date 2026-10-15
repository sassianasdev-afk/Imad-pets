import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useTranslation } from '../context/LanguageContext'

const About = () => {
  const { t } = useTranslation();
  return (
    <div>
    <div className='text-2xl text-center pt-8 border-t'>
      <Title text1={t('about.aboutUs')} text2={t('about.us')} />
    </div>

    <div className='my-10 flex flex-col md:flex-row gap-16'>
      <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
      <p>{t('about.brandStoryP1')}</p>
      <p>
{t('about.brandStoryP2')}</p>
      <b className=' text-gray-800'>{t('about.mission')}</b>
      <p>{t('about.missionText')}</p>
      </div>
    </div>

    <div className='text-xl py-4'>
      <Title text1={t('about.why')} text2={t('about.chooseUs')}/>
    </div>

    <div className='flex flex-col md:flex-row text-sm mb-20'>
      <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>{t('about.qualityAssurance')}</b>
        <p className='text-gray-600'>{t('about.qualityText')}</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>{t('about.convenience')}</b>
        <p className='text-gray-600'>{t('about.convenienceText')}</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>{t('about.exceptionalService')}</b>
        <p className='text-gray-600'>{t('about.serviceText')}</p>
      </div>


    </div>
<NewsletterBox 
  top={t('newsletter.whoWeAre')}
  midle={t('newsletter.aboutUs')}
  bottom={t('newsletter.learnStory')}
/>


    </div>
  )
}

export default About