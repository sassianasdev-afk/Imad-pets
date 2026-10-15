import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/frontend_assets/assets';
import { useTranslation } from '../context/LanguageContext';

const Orders = () => {
  const { t } = useTranslation();
  const { backendUrl, token, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;
      //  حذف { headers: { token } }
      const response = await axios.post(backendUrl + '/api/order/userorders', {});
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={t('orders.myOrders').split(' ')[0]} text2={t('orders.myOrders').split(' ')[1]} />
      </div>
      <div>
        {orderData.length === 0 ? (
          <div className='text-center py-20 border-2 border-gray-200 rounded-lg'>
            <img src={assets.logo} alt="" className='w-1/2 mx-auto mb-4 opacity-50' />
            <p className='text-gray-500 text-lg'>{t('orders.ordersNotFound')}</p>
          </div>
        ) : (
          orderData.map((item, index) => {
            // Check if product still exists in database
            const productExists = products.find((product) => product._id === item._id);
            const isDeleted = !productExists;

            return (
              <div key={index} className='py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  {isDeleted ? (
                    <div className='w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center'>
                      <span className='text-gray-500 text-[10px] text-center px-1'>{t('common.deletedProduct')}</span>
                    </div>
                  ) : item.image && item.image[0] ? (
                    <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                  ) : (
                    <div className='w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center'>
                      <span className='text-gray-500 text-[10px] text-center px-1'>no image</span>
                    </div>
                  )}
                  <div>
                    <p className={`sm:text-base font-medium ${isDeleted ? 'line-through' : ''}`}>{item.name}</p>
                    {isDeleted && (
                      <p className='text-gray-500 text-xs mt-1'>{t('orders.deletedMsg')}</p>
                    )}
                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                      <p className='text-lg'>{currency} {item.price}</p>
                      <p>{t('orders.quantity')} {item.quantity}</p>
                      <p>{t('orders.size')} {item.size}</p>
                    </div>
                    <p className='mt-1'>{t('orders.date')} <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>{t('orders.payment')} <span className='text-gray-400'>{item.paymentMethod}</span></p>
                  </div>
                </div>
                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                  </div>
                  <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm active:bg-gray-50'>{t('orders.trackOrder')}</button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Orders