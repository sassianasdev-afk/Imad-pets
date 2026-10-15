import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import { useTranslation } from '../context/LanguageContext';

const ProductItem = ({id,image,name,price,bestseller}) => {
    const { t } = useTranslation();
    const {currency} = useContext(ShopContext);
    

  return (
    <Link className='text-gray-700 cursor-pointer relative border ' to={`/product/${id}`}>
  {/* Icon Bestseller */}
  {bestseller && (
    <div className="absolute top-1 left-1 w-10 h-10 z-10">
      
      {/* Original PNG */}
      <img
        src={assets.bestseller}
        alt={assets.bestseller}
        className="relative w-full h-full"
      />
    </div>
  )}

  <div className='overflow-hidden'>
    {image && image[0] ? (
      <img className='hover:scale-110 transition ease-in-out' 
      key={id} 
      src={image[0]} 
      alt={name}
      />
    ) : (
      <div className='w-full aspect-[3/4] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center'>
        <span className='text-gray-500 text-xs text-center px-2'>{t('common.productWithoutImage')}</span>
      </div>
    )}
  </div>
  <div className='p-2'>
  <p className='pt-3 pb-1 text-sm truncate'>{name}</p>
  <p className='text-sm font-medium'>{currency}{price}</p>
  </div>
</Link>
  )
}

export default ProductItem