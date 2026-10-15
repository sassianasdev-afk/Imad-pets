import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/admin_assets/assets'
import { useSearchParams } from 'react-router-dom'
import OrderStatusNav from '../components/OrderStatusNav'
import OrdersSkeleton from '../components/OrdersSkeleton'

// حذف { token } من props — cookie كتمشي أوتوماتيك
const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showConfirm, setShowConfirm] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [orderToDeleteName, setOrderToDeleteName] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(null)
  const isPending = ['Order Placed','Packing','Shipped','Out for delivery']
  const currentPage = parseInt(searchParams.get('page')) || 1
  const statusFilter = searchParams.get('status') || 'all'
  const ordersPerPage = 6

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      // حذف { headers: { token } }
      const response = await axios.post(backendUrl + '/api/order/list', {})
      if (response.data.success) {
        let filteredOrders = response.data.orders
        
        // Filter orders based on status
        if (statusFilter === 'pending') {
          // Show all pending orders (Order Placed, Packing, Shipped, Out for delivery)
          filteredOrders = filteredOrders.filter(order => isPending.includes(order.status))
        } else if (statusFilter !== 'all') {
          filteredOrders = filteredOrders.filter(order => order.status === statusFilter)
        }
        
        setOrders(filteredOrders)
      } else {
        toast.error(response.data.message)
      }
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      // حذف { headers: { token } }
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value }
      )
      if (response.data.success) {
        await fetchAllOrders()
        // Trigger sidebar refresh by emitting custom event
        window.dispatchEvent(new CustomEvent('refreshPendingCount'))
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const openConfirmModal = (order) => {
    setOrderToDelete(order._id)
    setOrderToDeleteName(order.address.firstName + ' ' + order.address.lastName)
    setShowConfirm(true)
  }

  const closeConfirmModal = () => {
    setShowConfirm(false)
    setOrderToDelete(null)
    setOrderToDeleteName('')
  }

  const confirmDelete = async () => {
    if (!orderToDelete) return

    setLoadingDelete(orderToDelete)
    setShowConfirm(false)

    try {
      const response = await axios.post(
        backendUrl + '/api/order/delete',
        { orderId: orderToDelete }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchAllOrders()
        window.dispatchEvent(new CustomEvent('refreshPendingCount'))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoadingDelete(null)
      setOrderToDelete(null)
      setOrderToDeleteName('')
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [statusFilter])
  

  // Calculate pending orders count
  const pendingCount = orders.filter(order => isPending.includes(order.status)).length

  return (
    <div>
      <h3 className='mb-4 text-xl font-semibold'>Order Page</h3>
      
      <OrderStatusNav 
        statusFilter={statusFilter}
        setSearchParams={setSearchParams}
        pendingCount={pendingCount}
      />
      
      <div>
        {loading ? (
          <OrdersSkeleton count={5} />
        ) : orders.length === 0 ? (
          <div className='text-center py-20 border-2 border-gray-200 rounded-lg'>
            <img src={assets.parcel_icon} alt="" className='w-20 mx-auto mb-4 opacity-50' />
            <p className='text-gray-500 text-lg'>No orders found</p>
          </div>
        ) : (
          <>
            {[...orders]
              .reverse()
              .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
              .map((order) => (
                <div className={`relative grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 ${isPending.includes(order.status) ? 'bg-gray-200 border-gray-400' : 'border-gray-200'}`} key={order._id}>
                  {isPending.includes(order.status) && (
                    <div className='absolute -top-2 -left-2 bg-black text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm'>
                      !
                    </div>
                  )}
                  <div className='relative'>
                    <img className='w-12' src={assets.parcel_icon} alt="" />
                    
                  </div>
                  <div>
                    <div>
                      {order.items.map((item, idx) => (
                        <p className='py-0.5' key={idx}>
                          {item.name} x {item.quantity} <span>{item.size}</span>
                          {idx !== order.items.length - 1 && ' ,'}
                        </p>
                      ))}
                    </div>
                    <p className='mt-3 mb-2 font-medium'>
                      {order.address.firstName + " " + order.address.lastName}
                    </p>
                    <div>
                      <p>{order.address.street + ","}</p>
                      <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                    </div>
                    <p>{order.address.phone}</p>
                  </div>
                  <div>
                    <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                    <p className='mt-3'>Method : {order.paymentMethod}</p>
                    <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                    <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <p className='text-sm sm:text-[15px]'>{currency} {order.amount}</p>
                  <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold border rounded'>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                  <button 
                    onClick={() => openConfirmModal(order)} 
                    disabled={loadingDelete === order._id}
                    className={`p-2 font-semibold border rounded text-white ${loadingDelete === order._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {loadingDelete === order._id ? 'DELETING...' : 'Delete'}
                  </button>
                </div>
              ))}
            
            {/* Pagination Controls */}
            {orders.length > ordersPerPage && (
              <div className='flex flex-col sm:flex-row justify-between items-center mt-8 p-4 border-t border-gray-200'>
                <div className='text-sm text-gray-600 mb-4 sm:mb-0'>
                  Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, orders.length)} of {orders.length} orders
                </div>
                <div className='flex flex-wrap gap-2'>
                  <button
                    onClick={() => {
                      const newPage = Math.max(currentPage - 1, 1)
                      setSearchParams({ status: statusFilter, page: newPage.toString() })
                    }}
                    disabled={currentPage === 1}
                    className='px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors'
                  >
                    {'<'}
                  </button>
                  
                  {/* Page Numbers */}
                  {(() => {
                    const totalPages = Math.ceil(orders.length / ordersPerPage);
                    const pages = [];
                    
                    // Always show first page
                    if (totalPages > 1) {
                      pages.push(1);
                    }
                    
                    // Show ellipsis after first page if needed
                    if (totalPages > 2 && currentPage > 3) {
                      pages.push('...');
                    }
                    
                    // Show pages around current page
                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = startPage; i <= endPage; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(i);
                      }
                    }
                    
                    // Show ellipsis before last page if needed
                    if (totalPages > 2 && currentPage < totalPages - 2) {
                      pages.push('...');
                    }
                    
                    // Always show last page if different from first
                    if (totalPages > 1) {
                      pages.push(totalPages);
                    }
                    
                    return pages.map((pageNum, index) => {
                      if (pageNum === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className='px-3 py-1 text-gray-500'>
                            ...
                          </span>
                        );
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setSearchParams({ status: statusFilter, page: pageNum.toString() })}
                          className={`px-3 py-1 border rounded-md transition-colors ${
                            currentPage === pageNum
                              ? 'bg-black text-white border-black'
                              : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}
                  
                  <button
                    onClick={() => {
                      const newPage = Math.min(currentPage + 1, Math.ceil(orders.length / ordersPerPage))
                      setSearchParams({ status: statusFilter, page: newPage.toString() })
                    }}
                    disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
                    className='px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-colors'
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg border border-gray-200 p-6 w-full max-w-sm shadow-lg'>
            <h3 className='text-lg font-semibold mb-4 text-black'>Delete Order</h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete order for <span className='font-semibold text-black'>"{orderToDeleteName}"</span>?
            </p>
            <div className='flex gap-3'>
              <button
                onClick={closeConfirmModal}
                className='flex-1 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='flex-1 py-2 px-4 bg-black text-white border border-black rounded-lg font-medium hover:bg-gray-800 transition-colors'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders