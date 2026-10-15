import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
    <div className='text-2xl text-center pt-8 border-t'>
      <Title text1={'ABOUT'} text2={'US'} />
    </div>

    <div className='my-10 flex flex-col md:flex-row gap-16'>
      <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
      <p>Our brand was created out of a true passion for pets and their well-being. From the very beginning, our mission has been to provide high-quality pet products, food, and accessories that keep your furry friends happy and healthy.</p>
      <p>
We believe that pet care should be accessible, reliable, and enjoyable. That's why every product in our collection is carefully selected to ensure quality, safety, and comfort for your pets, giving you peace of mind with every purchase.</p>
      <b className=' text-gray-800'>Our Mission</b>
      <p>Our mission is to provide reliable and quality pet products that balance nutrition, comfort, and style, while ensuring customer satisfaction and creating a unique shopping journey for pet parents.</p>
      </div>
    </div>

    <div className='text-xl py-4'>
      <Title text1={'WHY'} text2={'CHOOSE US'}/>
    </div>

    <div className='flex flex-col md:flex-row text-sm mb-20'>
      <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>Quality Assurance:</b>
        <p className='text-gray-600'>At Imad Pets, we carefully handpick every product to ensure premium quality and safety for your pets. Our collections are crafted with attention to detail, bringing you pet care that is both reliable and trustworthy.</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>Convenience:</b>
        <p className='text-gray-600'>Enjoy a smooth and hassle-free shopping experience with our user-friendly store. From browsing the latest pet products to secure checkout, Imad Pets makes pet care shopping simple and enjoyable.</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
        <b>Exceptional Customer Service:</b>
        <p className='text-gray-600'>Our dedicated support team is always ready to assist you. At Imad Pets, we value every customer and their furry companions, and strive to provide personalized help, making your shopping journey as seamless as possible.</p>
      </div>


    </div>
<NewsletterBox 
  top="Who We Are"
  midle="About Us"
  bottom="Learn our story."
/>


    </div>
  )
}

export default About