import React from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function LoadingProducts({showReview,totalReviews}) {
  return (
    <>
    <div className="border-t-1 pt-10">
          <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
            {/* Product Images Skeleton */}
            <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-3">
                {Array(4).fill(0).map((_, index) => (
                  <Skeleton key={index} className="w-[24%] sm:w-full aspect-square" />
                ))}
              </div>
              <div className="w-full sm:w-[88%]">
                <Skeleton className="w-full aspect-square" />
              </div>
            </div>
    
            {/* Product Info Skeleton */}
            <div className="flex-1">
              <Skeleton height={32} width="80%" className="mt-2" />
              <div className="flex items-center gap-1 mt-2">
                <Skeleton width={100} height={20} />
              </div>
              <Skeleton height={36} width={120} className="mt-5" />
              <div className="mt-5 space-y-2">
                <Skeleton count={3} height={16} />
              </div>
              <div className="flex flex-col gap-4 my-8">
                <Skeleton width={100} height={20} />
                <div className="flex flex-wrap gap-2">
                  {Array(5).fill(0).map((_, index) => (
                    <Skeleton key={index} width={60} height={40} />
                  ))}
                </div>
              </div>
              <Skeleton width={150} height={45} />
              <Skeleton className="mt-8 w-4/5" height={1} />
              <div className="text-sm mt-5 space-y-2">
                <Skeleton count={3} height={16} />
              </div>
            </div>
          </div>
    
          {/* Description Section Skeleton */}
          <div className="mt-20">
            <div className="flex">
              <p  className={`border px-5 py-3 text-sm cursor-pointer  ${showReview ? '' : 'font-semibold'}`}>Description</p>
              <p className={`border px-5 py-3 text-sm cursor-pointer ${showReview ? 'font-semibold' : ''}`}>Reviews ({totalReviews})</p>
            </div>
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 overflow-y-scroll h-80">
              <Skeleton count={18} height={14} />
            </div>
          </div>
        </div>
    </>
  )
}

export default LoadingProducts