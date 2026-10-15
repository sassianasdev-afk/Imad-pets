import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { useTranslation } from '../context/LanguageContext'

const Home = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox 
  top={t('newsletter.stayUpdated')}
  midle={t('newsletter.joinUs')}
  bottom={t('newsletter.getLatest')}
/>

    </div>
  )
}

export default Home