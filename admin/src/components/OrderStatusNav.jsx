import React from 'react'
import { useTranslation } from '../context/LanguageContext'

const OrderStatusNav = ({ statusFilter, setSearchParams, pendingCount }) => {
  const { t } = useTranslation();

  const statusButtons = [
    { status: 'all', label: t('orderStatus.all'), showBadge: false },
    { status: 'pending', label: t('orderStatus.pending'), showBadge: true },
    { status: 'Delivered', label: t('orderStatus.delivered'), showBadge: false },
    { status: 'Canceled', label: t('orderStatus.canceled'), showBadge: false },
  ]

  return (
    <div className='mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4'>
      {statusButtons.map(({ status, label, showBadge }) => (
        <button
          key={status}
          onClick={() => setSearchParams({ status, page: '1' })}
          className={`relative px-4 py-2 rounded-lg font-medium transition-colors border ${
            statusFilter === status
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {label}
          {showBadge && pendingCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full'>
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default OrderStatusNav
