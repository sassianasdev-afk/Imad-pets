import React, { useState, useCallback } from 'react'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'
import { useTranslation } from '../context/LanguageContext'

// Function to get cropped image as blob
const getCroppedImg = async (imageSrc, crop, aspect = 4 / 5) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match the crop aspect ratio
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
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

// حذف { token } من props — cookie كتمشي أوتوماتيك
const Add = () => {
  const { t } = useTranslation();

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [tempImageUrl, setTempImageUrl] = useState(null)
  const [showCropper, setShowCropper] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Dogs");
  const [subCategory, setSubCategory] = useState("Animal");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false)

  const clear = () => setSizes([]);

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
        case 1: setImage1(croppedFile); break
        case 2: setImage2(croppedFile); break
        case 3: setImage3(croppedFile); break
        case 4: setImage4(croppedFile); break
      }
      
      setShowCropper(false)
      setTempImageUrl(null)
      toast.success('Image cropped successfully!')
    } catch (error) {
      toast.error(t('productForm.errorCropping'))
    }
  }

  const cancelCrop = () => {
    setShowCropper(false)
    setTempImageUrl(null)
    setActiveImage(null)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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

      if (!image1) {
        toast.error(t('productForm.addImage'))
        return null
      }

      if (sizes.length == 0) {
        toast.error(t('productForm.selectSizes'))
        return null
      }

      // حذف { headers: { token } } — cookie كتمشي أوتوماتيك
      const response = await axios.post(backendUrl + '/api/product/add', formData)

      if (response.data.success) {
        toast.success(response.data.message)

        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setName("")
        setDescription("")
        setCategory("Dogs")
        setSubCategory("Animal")
        setBestseller(false)
        setSizes([])
        setPrice("")

      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
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
          <div className='flex gap-2 '>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e) => handleImageSelect(e, 1)} type="file" id='image1' hidden accept="image/*" />
            </label>
            {image1 &&
              <>
                <label htmlFor="image2">
                  <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                  <input onChange={(e) => handleImageSelect(e, 2)} type="file" id='image2' hidden accept="image/*" />
                </label>
                <label htmlFor="image3">
                  <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                  <input onChange={(e) => handleImageSelect(e, 3)} type="file" id='image3' hidden accept="image/*" />
                </label>
                <label htmlFor="image4">
                  <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                  <input onChange={(e) => handleImageSelect(e, 4)} type="file" id='image4' hidden accept="image/*" />
                </label>
              </>
            }
          </div>
        </div>

        {/* Image Cropper Modal */}
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
                  onClick={cancelCrop}
                  className='flex-1 py-2 border border-gray-300 rounded hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className='flex-1 py-2 bg-black text-white rounded hover:bg-gray-800'
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='w-full'>
          <p className='mb-2'>{t('productForm.productName')}</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder={t('productForm.typeHere')} required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>{t('productForm.productDescription')}</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder={t('productForm.writeContent')} required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>{t('productForm.productCategory')}</p>
            <select onClick={clear} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 sm:w-[120px]'>
              <option value="Dogs">{t('productForm.dogs')}</option>
              <option value="Cats">{t('productForm.cats')}</option>
              <option value="Birds">{t('productForm.birds')}</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>{t('productForm.subCategory')}</p>
            <select onClick={clear} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Animal">{t('productForm.animal')}</option>
              <option value="Accessories">{t('productForm.accessories')}</option>
              <option value="Food">{t('productForm.food')}</option>
              <option value="Drinks">{t('productForm.drinks')}</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>{t('productForm.productPrice')}</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' placeholder={t('productForm.placeholder25')} type="Number" required />
          </div>
        </div>

        {subCategory === 'Animal' &&
          <div>
            <p className='mb-2'>{t('productForm.productAge')}</p>
            <div className='flex flex-wrap gap-3'>
              {["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "2 Years", "3 Years", "5 Years"].map(s => (
                <div key={s} onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s])}>
                  <p className={`${sizes.includes(s) ? "bg-orange-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        }

        {subCategory === 'Accessories' &&
          <div>
            <p className='mb-2'>{t('productForm.productSizes')}</p>
            <div className='flex flex-wrap gap-3'>
              {["standar","S", "M", "L", "XL", "XXL"].map(s => (
                <div key={s} onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s])}>
                  <p className={`${sizes.includes(s) ? "bg-orange-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        }

        {subCategory === 'Food' &&
          <div>
            <p className='mb-2'>{t('productForm.productWeight')}</p>
            <div className='flex flex-wrap gap-3'>
              {["100g", "250g", "500g", "1kg", "2kg", "5kg", "10kg"].map(s => (
                <div key={s} onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s])}>
                  <p className={`${sizes.includes(s) ? "bg-orange-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        }

        {subCategory === 'Drinks' &&
          <div>
            <p className='mb-2'>{t('productForm.productVolume')}</p>
            <div className='flex flex-wrap gap-3'>
              {["250ml", "500ml", "1L", "2L", "5L"].map(s => (
                <div key={s} onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s])}>
                  <p className={`${sizes.includes(s) ? "bg-orange-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        }

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} className='accent-black' type="checkbox" id='bestseller' />
          <label htmlFor="bestseller" className='cursor-pointer'>{t('productForm.addToBestseller')}</label>
        </div>

        {!loading &&
          <button type='submit' className='w-28 py-3 mt-2 bg-black text-white active:bg-gray-800'>{t('productForm.add')}</button>
        }
      </form>
      {loading &&
        <button className='w-28 py-3 mt-2 bg-gray-700 text-white'>{t('productForm.adding')}</button>
      }
    </div>
  )
}

export default Add