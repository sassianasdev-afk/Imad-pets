import React from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingReviews = () => {
    return (
        <>
            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="border p-4">
                        <div className="ml-4 py-2 grid items-start grid-cols-[1fr_7fr]">
                            <Skeleton circle width={40} height={40} />
                            <div>
                                <Skeleton width={100} height={20} />
                                <Skeleton width={80} height={16} className="mt-1" />
                            </div>
                        </div>
                        <div className="ml-4 py-2 grid grid-cols-[1fr_7fr]">
                            <div></div>
                            <Skeleton count={2} height={14} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default LoadingReviews