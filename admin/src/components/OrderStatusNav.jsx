import React from 'react'

const OrderStatusNav = ({ statusFilter, setSearchParams, pendingCount }) => {
  

  const statusButtons = [
    { status: 'all', label: 'All Orders', showBadge: false },
    { status: 'pending', label: 'Pending', showBadge: true },
    { status: 'Delivered', label: 'Delivered', showBadge: false },
    { status: 'Canceled', label: 'Canceled', showBadge: false },
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
