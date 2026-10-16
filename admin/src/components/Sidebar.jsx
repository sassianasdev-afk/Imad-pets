import React, { useEffect, useState } from 'react'
import {NavLink} from 'react-router-dom'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { useTranslation } from '../context/LanguageContext'

const Sidebar = () => {
  const { t } = useTranslation();
  const [pendingCount, setPendingCount] = useState(0)
  const [prevPendingCount, setPrevPendingCount] = useState(0)
  const [notifPermission, setNotifPermission] = useState('default')
  const isPending = ['Order Placed','Packing','Shipped','Out for delivery']

  const playOrderNotification = () => {
    try {
      const audio = new Audio(assets.notification)
      audio.volume = 0.7
      audio.play().catch((err) => console.log('Audio play blocked:', err))
    } catch (error) {
      console.log('Error playing notification:', error)
    }
  }

  const showDesktopNotification = (orderCount) => {
    if (notifPermission === 'granted' && 'Notification' in window) {
      new Notification('Imad Pets - New Order', {
        body: `You have ${orderCount} new pending order(s).`,
        icon: assets.logo,
        tag: 'new-order',
        requireInteraction: true,
        silent: false,
      })
    }
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    setNotifPermission(permission)
  }

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

  // Request notification permission + poll for new orders on mount
  useEffect(() => {
    requestNotificationPermission()
    fetchPendingOrdersCount()
    const interval = setInterval(fetchPendingOrdersCount, 5000)
    
    const handleRefresh = () => fetchPendingOrdersCount()
    window.addEventListener('refreshPendingCount', handleRefresh)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('refreshPendingCount', handleRefresh)
    }
  }, [])

  // Show desktop notification + sound when a new pending order arrives
  useEffect(() => {
    if (pendingCount > prevPendingCount && prevPendingCount > 0) {
      showDesktopNotification(pendingCount)
      playOrderNotification()
    }
    setPrevPendingCount(pendingCount)
  }, [pendingCount, prevPendingCount, notifPermission])

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
