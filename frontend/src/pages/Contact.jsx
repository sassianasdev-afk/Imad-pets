import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>

    <div className='text-center text-2xl pt-10 border-t'>
      <Title text1={'CONTACT'} text2={'US'} />
    </div>
    <div className='my-10 flex flex-col  md:flex-row gap-10 mb-28'>
      <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
      <div className='flex flex-col justify-center items-start gap-6'>
        <p className='font-semibold text-xl text-gray-600'>Our store</p>
        <p className='text-gray-500'>meknes elmanar imm b0 appt5 <br /> VN MEKNES</p>
        <p className='text-gray-500'>Tel: (212)629-400-699 <br /> Email: sassianasdev@gmail.com</p>
        <p className='font-semibold text-xl text-gray-600'>Careers at Imad Pets</p>
        <p className='text-gray-500'>Learn more about our items and job openings.</p>
        <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
      </div>

    </div>
<NewsletterBox 
  top="Need Help?"
  midle="Contact Us"
  bottom="We're here for you."
/>


    </div>
  )
}

export default Contact