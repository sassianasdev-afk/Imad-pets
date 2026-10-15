import React, { useEffect, useState, useCallback } from 'react'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import { useTranslation } from '../context/LanguageContext'

// Function to get cropped image as blob
const getCroppedImg = async (imageSrc, crop, aspect = 4 / 5) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const cropWidth = crop.width;
  const cropHeight = crop.width / aspect;

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

//  حذف { token } من props — cookie كتمشي أوتوماتيك
const Update = () => {
  const { t } = useTranslation();

  const { id } = useParams()
  const navigate = useNavigate()

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [oldImages, setOldImages] = useState([])
  const [removedIndices, setRemovedIndices] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Dogs")
  const [subCategory, setSubCategory] = useState("Animal")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)

  // Cropper states - for empty slots like Add.jsx
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [tempImageUrl, setTempImageUrl] = useState(null)
  const [showCropper, setShowCropper] = useState(false)

  const clear = () => setSizes([])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleImageSelect = (e, imageNum) => {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setTempImageUrl(url)
    setActiveImage(imageNum)
    setShowCropper(true)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const applyCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(tempImageUrl, croppedAreaPixels, 4 / 5)
      const croppedFile = new File([croppedBlob], `image${activeImage}.jpg`, { type: 'image/jpeg' })

      switch (activeImage) {
        case 0: setImage1(croppedFile); break
        case 1: setImage2(croppedFile); break
        case 2: setImage3(croppedFile); break
        case 3: setImage4(croppedFile); break
      }

      setShowCropper(false)
      setTempImageUrl(null)
      toast.success(t('productForm.imageCroppedAdded'))
    } catch (error) {
      console.error('Crop error:', error)
      toast.error(t('productForm.errorCropping'))
    }
  }

  const cancelCrop = () => {
    setShowCropper(false)
    setTempImageUrl(null)
    setActiveImage(null)
  }

  const handleRemoveImage = (index) => {
    // Check if it's a new image (File object) or old image (URL string)
    const hasNewImage = [image1, image2, image3, image4][index]
    const hasOldImage = oldImages[index]

    if (hasNewImage) {
      // For new images (File objects), just clear the state
      if (index === 0) setImage1(false)
      if (index === 1) setImage2(false)
      if (index === 2) setImage3(false)
      if (index === 3) setImage4(false)
    } else if (hasOldImage) {
      // For old images, mark as removed and set to null
      const newOldImages = [...oldImages]
      newOldImages[index] = null
      setOldImages(newOldImages)

      // Track this index as removed to send to backend
      setRemovedIndices(prev => [...prev, index])
    }

    toast.success(t('productForm.imageRemoved'))
  }

  const fetchProduct = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/product/single', { productId: id })
      if (res.data.success) {
        const p = res.data.product
        setName(p.name)
        setDescription(p.description)
        setPrice(p.price)
        setCategory(p.category)
        setSubCategory(p.subCategory)
        setBestseller(p.bestseller)
        setSizes(p.sizes)
        setOldImages(p.image)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      // Send removed indices to backend
      if (removedIndices.length > 0) {
        formData.append("removedImages", JSON.stringify(removedIndices))
      }

      if (sizes.length === 0) {
        toast.error(t('productForm.selectSizes'))
        setLoading(false)
        return
      }

      //  حذف { headers: { token } }
      const res = await axios.put(backendUrl + `/api/product/update/${id}`, formData)

      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/list')
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>{t('productForm.uploadImage')}
            <span className='text-slate-400 block text-sm'>{t('productForm.sizeHint')}</span>
          </p>

          {/* Image Cropper Modal - like Add.jsx */}
          {showCropper && (
            <div className='fixed inset-0 bg-black/20 bg-opacity-75 z-50 flex flex-col items-center justify-center p-4'>
              <div className='bg-white rounded p-4 w-full max-w-lg'>
                <h3 className='text-lg font-medium mb-2'>{t('productForm.cropTitle')}</h3>
                <div className='relative w-full h-80 bg-gray-900'>
                  <Cropper
                    image={tempImageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 5}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className='mt-4'>
                  <label className='text-sm text-gray-600'>{t('productForm.zoom')}</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className='w-full mt-1'
                  />
                </div>
                <div className='flex gap-2 mt-4'>
                  <button
                    type="button"
                    onClick={cancelCrop}
                    className='flex-1 py-2 border border-gray-300 rounded hover:bg-gray-100'
                  >
                    {t('productForm.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={applyCrop}
                    className='flex-1 py-2 bg-black text-white rounded hover:bg-gray-800'
                  >
                    {t('productForm.applyCrop')}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className='flex gap-2'>
            {[0, 1, 2, 3].map((i) => {
              const hasNewImage = [image1, image2, image3, image4][i]
              const hasOldImage = oldImages[i]
              const hasImage = hasNewImage || hasOldImage

              return (
                <div key={i} className='relative'>
                  {hasImage && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className='absolute -top-2 -right-2 bg-black text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs z-10 hover:bg-gray-800 transition-colors'
                      title={t('productForm.removeImage')}
                    >
                      ×
                    </button>
                  )}
                  <label className='cursor-pointer'>
                    <img
                      className='w-20'
                      src={
                        hasNewImage
                          ? URL.createObjectURL([image1, image2, image3, image4][i])
                          : hasOldImage || assets.upload_area
                      }
                      alt=""
                    />
                    {/* Only show file input for empty slots (no old image) */}
                    {!hasOldImage && (
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, i)}
                      />
                    )}
                  </label>
                </div>
              )
            })}
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>{t('productForm.productName')}</p>
          <input value={name} onChange={e => setName(e.target.value)} className='w-full max-w-[500px] px-3 py-2' required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>{t('productForm.productDescription')}</p>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className='w-full max-w-[500px] px-3 py-2' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 sm:gap-8'>
          <div>
            <p className='mb-2'>{t('productForm.productCategory')}</p>
            <select onClick={clear} value={category} onChange={e => setCategory(e.target.value)} className='px-3 py-2'>
              <option value="Dogs">{t('productForm.dogs')}</option>
              <option value="Cats">{t('productForm.cats')}</option>
              <option value="Birds">{t('productForm.birds')}</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>{t('productForm.subCategory')}</p>
            <select onClick={clear} value={subCategory} onChange={e => setSubCategory(e.target.value)} className='px-3 py-2'>
              <option value="Animal">{t('productForm.animal')}</option>
              <option value="Accessories">{t('productForm.accessories')}</option>
              <option value="Food">{t('productForm.food')}</option>
              <option value="Drinks">{t('productForm.drinks')}</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>{t('productForm.productPrice')}</p>
            <input value={price} onChange={e => setPrice(e.target.value)} className='px-3 py-2 w-[120px]' type="number" />
          </div>
        </div>

        {subCategory === 'Animal' &&
          <div>
            <p className='mb-2'>{t('productForm.productAge')}</p>
            <div className='flex gap-3 flex-wrap'>
              {["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "2 Years", "3 Years", "5 Years"].map(s => (
                <p key={s}
                  onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                  className={`${sizes.includes(s) ? 'bg-orange-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                  {s}
                </p>
              ))}
            </div>
          </div>
        }

        {subCategory === 'Accessories' &&
          <div>
            <p className='mb-2'>{t('productForm.productSizes')}</p>
            <div className='flex gap-3 flex-wrap'>
              {["standar","S", "M", "L", "XL", "XXL"].map(s => (
                <p key={s}
                  onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                  className={`${sizes.includes(s) ? 'bg-orange-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                  {s}
                </p>
              ))}
            </div>
          </div>
        }

        {subCategory === 'Food' &&
          <div>
            <p className='mb-2'>{t('productForm.productWeight')}</p>
            <div className='flex gap-3 flex-wrap'>
              {["100g", "250g", "500g", "1kg", "2kg", "5kg", "10kg"].map(s => (
                <p key={s}
                  onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                  className={`${sizes.includes(s) ? 'bg-orange-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                  {s}
                </p>
              ))}
            </div>
          </div>
        }

        {subCategory === 'Drinks' &&
          <div>
            <p className='mb-2'>{t('productForm.productVolume')}</p>
            <div className='flex gap-3 flex-wrap'>
              {["250ml", "500ml", "1L", "2L", "5L"].map(s => (
                <p key={s}
                  onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
                  className={`${sizes.includes(s) ? 'bg-orange-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>
                  {s}
                </p>
              ))}
            </div>
          </div>
        }

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} className='accent-black' type="checkbox" id='bestseller' />
          <label htmlFor="bestseller" className='cursor-pointer'>{t('productForm.addToBestseller')}</label>
        </div>

        {!loading &&
          <button type='submit' className='w-28 py-3 mt-2 bg-black text-white active:bg-gray-800'>{t('productForm.update')}</button>
        }
      </form>
      {loading &&
        <button className='w-28 py-3 mt-2 bg-gray-700 text-white'>{t('productForm.updating')}</button>
      }
    </div>
  )
}

export default Update