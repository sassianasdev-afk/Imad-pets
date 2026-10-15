import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Header */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'PRIVACY'} text2={'POLICY'} />
      </div>

      {/* Main section */}
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.privacy_img} alt="Privacy Policy" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            At <b>Imad Pets</b>, your privacy is our top priority. We are committed to protecting your personal information 
            and ensuring that your shopping experience is safe and enjoyable. This Privacy Policy explains how we collect, 
            use, and safeguard your data when you visit or make a purchase from our website.
          </p>
          <p>
            By using our website, you agree to the terms of this policy. Please take a moment to read it carefully and 
            understand how your information is handled.
          </p>
          <b className='text-gray-800'>Information We Collect</b>
          <p>
            We may collect personal data such as your name, email, phone number, and shipping address. We also gather 
            non-personal information like browser type and device data to help us improve our services and website experience.
          </p>
        </div>
      </div>

      {/* WHY WE COLLECT Section */}
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'WE COLLECT DATA'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>To Improve Our Services:</b>
          <p className='text-gray-600'>
            We use collected data to enhance your shopping experience, update our collections, and personalize your journey on Imad Pets.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>To Process Orders:</b>
          <p className='text-gray-600'>
            Your personal details help us confirm orders, handle deliveries, and provide support related to your purchases.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>To Ensure Security:</b>
          <p className='text-gray-600'>
            We implement strict security measures to protect your information from unauthorized access, misuse, or alteration.
          </p>
        </div>
      </div>

      {/* Data Protection Section */}
      <div className='text-xl py-4'>
        <Title text1={'DATA'} text2={'PROTECTION'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Your information is stored securely and is only accessible to authorized personnel. We never share your 
            personal data with third parties, except when required to complete your order or comply with legal obligations.
          </p>
          <p>
            We also use encryption and security tools to safeguard payment information and ensure your transactions are safe.
          </p>
          <b className='text-gray-800'>Your Rights</b>
          <p>
            You have the right to request access, correction, or deletion of your personal data. To exercise these rights, 
            please contact us at <b>sassianasdev@gmail.com</b>.
          </p>
        </div>
        <img className='w-full md:max-w-[450px]' src={assets.contact_img} alt="Data Protection" />
      </div>

      {/* Contact Info */}
      <div className='text-center text-gray-600 mb-20'>
        <p>
          For any questions about this Privacy Policy or how we handle your data, please contact us:
        </p>
        <p className='mt-2'>Email: sassianasdev@gmail.com</p>
        <p>Phone: +212 629-400-699</p>
        <p>Address: Meknes El Manar 1 IMM B0 APPT 5, Morocco</p>
      </div>


    </div>
  )
}

export default PrivacyPolicy
