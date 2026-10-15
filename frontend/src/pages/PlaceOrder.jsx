import React, { useState, useContext } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Rib from '../components/Rib'
import { useTranslation } from '../context/LanguageContext'

const PlaceOrder = () => {
  const { t } = useTranslation();

  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  })

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    setLoading(true)

    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        case 'cod':
          //  حذف { headers: { token } }
          const response = await axios.post(backendUrl + '/api/order/place', orderData)
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData)
          if (responseStripe.data.success) {
            window.location.replace(responseStripe.data.session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;
        case 'rib':
          const responseRIB = await axios.post(backendUrl + '/api/order/rib', orderData)
          if (responseRIB.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(responseRIB.data.message)
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'><Title text1={t('placeOrder.deliveryInformation').split(' ')[0]} text2={t('placeOrder.deliveryInformation').split(' ')[1]} /></div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder={t('placeOrder.firstName')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder={t('placeOrder.lastName')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder={t('placeOrder.emailAddress')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder={t('placeOrder.street')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder={t('placeOrder.city')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder={t('placeOrder.state')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder={t('placeOrder.zipcode')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder={t('placeOrder.country')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder={t('placeOrder.phone')} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
      </div>
      <div className='mt-8'>
        <div className='mt-8 min-w-80'><CartTotal /></div>
        <div className='mt-12'>
          <Title text1={t('placeOrder.paymentMethod').split(' ')[0]} text2={t('placeOrder.paymentMethod').split(' ')[1]} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            {/* <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div> */}
            <div onClick={() => setMethod('rib')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'rib' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>{t('placeOrder.cashOnDelivery')}</p>
            </div>
          </div>

          <div className='mt-8 min-w-80'>

            {method === 'rib' &&
              <Rib />
            }

          </div>
          <div className='w-full text-end mt-8'>
            {loading ?
              <div className='bg-gray-800 text-white px-16 py-3 w-full text-center text-sm'>{t('placeOrder.pleaseWait')}</div>
              :
              <button type='submit' className='bg-black text-white px-16 w-full  py-3 text-sm'>{t('placeOrder.placeOrder')}</button>

            }
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder