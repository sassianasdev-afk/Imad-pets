import React, { useEffect, useState } from 'react'
import {NavLink} from 'react-router-dom'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { useTranslation } from '../context/LanguageContext'

const Sidebar = () => {
  const { t } = useTranslation();
  const [pendingCount, setPendingCount] = useState(0)
  const isPending = ['Order Placed','Packing','Shipped','Out for delivery']

  const fetchPendingOrdersCount = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {})
      if (response.data.success) {
        const pendingOrders = response.data.orders.filter(order => isPending.includes(order.status))
        setPendingCount(pendingOrders.length)
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error)
    }
  }

  useEffect(() => {
    fetchPendingOrdersCount()
    // Refresh count every 5 seconds for real-time updates
    const interval = setInterval(fetchPendingOrdersCount, 5000)
    
    // Listen for custom event to refresh count when order status changes
    const handleRefresh = () => fetchPendingOrdersCount()
    window.addEventListener('refreshPendingCount', handleRefresh)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('refreshPendingCount', handleRefresh)
    }
  }, [])

  return (
    <div className='w-[18%] min-h-screen border-r-1'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ' to={'/add'}>
                <img className='w-5 h-5' src={assets.add_icon} alt="" />
                <p className='hidden md:block'>{t('productForm.add')}</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ' to={'/list'}>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>{t('productList.title')}</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l relative' to={'/orders'}>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>{t('orderPage.title')}</p>
                {pendingCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                        {pendingCount > 99 ? '99+' : pendingCount}
                    </span>
                )}
            </NavLink>

        </div>
    </div>
  )
}

export default Sidebar