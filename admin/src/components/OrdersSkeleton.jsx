import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const OrdersSkeleton = ({ count = 5 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4'>
          <Skeleton circle width={48} height={48} />
          <div className='space-y-2'>
            <Skeleton count={2} height={16} />
            <Skeleton height={18} width="60%" className='mt-3' />
            <Skeleton count={3} height={14} className='mt-2' />
            <Skeleton height={14} width="50%" />
          </div>
          <div className='space-y-2'>
            <Skeleton height={16} width="80%" />
            <Skeleton height={14} width="70%" className='mt-3' />
            <Skeleton height={14} width="60%" />
            <Skeleton height={14} width="75%" />
          </div>
          <Skeleton height={18} width={80} />
          <Skeleton height={40} width="100%" />
        </div>
      ))}
    </>
  )
}

export default OrdersSkeleton
