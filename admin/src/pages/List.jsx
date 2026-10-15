import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { assets } from '../assets/admin_assets/assets'
import { useNavigate } from 'react-router-dom'
import ListLoading from '../components/ListLoading'
import { useTranslation } from '../context/LanguageContext'

//  حذف { token } من props
const List = () => {
  const { t } = useTranslation();

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setLoading(false)
    }
  }

  const openConfirmModal = (id, name) => {
    setProductToDelete({ id, name })
    setShowConfirm(true)
  }

  const closeConfirmModal = () => {
    setShowConfirm(false)
    setProductToDelete(null)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setLoadingDelete(productToDelete.id)
    setShowConfirm(false)

    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id: productToDelete.id })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoadingDelete(null)
      setProductToDelete(null)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2 '>{t('productList.title')}</p>
      <div className='flex flex-col gap-2'>

        {list.length !== 0 && <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>{t('productList.image')}</b>
          <b>{t('productList.name')}</b>
          <b>{t('productList.category')}</b>
          <b>{t('productList.price')}</b>
          <b className='text-center'>{t('productList.action')}</b>
        </div>}

        {loading ? (
          <ListLoading/>
        ) : list.length === 0 ? (
          <div className='text-center py-20 border-2 border-gray-200 rounded-lg'>
            <img src={assets.cloth_icon} alt="" className='w-20 mx-auto mb-4 opacity-50' />
            <p className='text-gray-500 text-lg'>{t('productList.none')}</p>
          </div>
        ) : (
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img onClick={() => navigate(`/update/${item._id}`)} className='w-12 object-cover bg-gray-200' src={item.image && item.image[0] ? item.image[0] : assets.upload_area} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency} {item.price}</p>
              <p onClick={() => openConfirmModal(item._id, item.name)} className='text-right md:text-center cursor-pointer text-lg'>
                {loadingDelete === item._id ? t('productList.deleting') : t('productList.x')}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg border border-gray-200 p-6 w-full max-w-sm shadow-lg'>
            <h3 className='text-lg font-semibold mb-4 text-black'>{t('productList.deleteProduct')}</h3>
            <p className='text-gray-600 mb-6'>
              {t('productList.confirm')} <span className='font-semibold text-black'>"{productToDelete?.name}"</span>?
            </p>
            <div className='flex gap-3'>
              <button
                onClick={closeConfirmModal}
                className='flex-1 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors'
              >
                {t('productList.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className='flex-1 py-2 px-4 bg-black text-white border border-black rounded-lg font-medium hover:bg-gray-800 transition-colors'
              >
                {t('productList.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List