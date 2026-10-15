import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ListLoading = () => {
    return (
        <div className='flex flex-col gap-2'>

            <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b className='text-center'>Action</b>
            </div>
            <div className='flex flex-col gap-2'>
                {
                    Array(8).fill(0).map((_, index) => (
                        <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
                            <Skeleton width={48} height={58} />
                            <Skeleton height={16} />
                            <Skeleton height={16} />
                            <Skeleton height={16} />
                            <Skeleton height={16} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ListLoading