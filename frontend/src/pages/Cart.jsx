
// Cart.jsx
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, loading } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);


  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);

    }
  }, [cartItems, products]);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {loading ? (
          Array(1).fill(0).map((_, index) => (
            <div key={index} className='py-4 border-t border-b grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <Skeleton className='w-16 sm:w-20 h-16 sm:h-20' />
                <div className="flex-1">
                  <Skeleton count={1} height={16} width="70%" />
                  <Skeleton count={1} height={16} width="40%" className="mt-2" />
                </div>
              </div>
              <Skeleton height={40} width={80} />
              <Skeleton circle width={16} height={16} />
            </div>
          ))
        ) : cartData.length !== 0 ? (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);

            return (
              <div key={index} className='py-4 z-1 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  {productData.image && productData.image[0] ? (
                    <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  ) : (
                    <div className='w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center'>
                      <span className='text-gray-500 text-[10px] text-center px-1'>no image</span>
                    </div>
                  )}
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row gap-3 items-center'>
                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                    className='px-2 sm:px-3 py-1 border hover:bg-gray-100 transition-colors'
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className='px-2 sm:px-3 border py-1 min-w-[30px] text-center'>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                    className='px-2 sm:px-3 py-1 border hover:bg-gray-100 transition-colors'
                  >
                    +
                  </button>
                </div>
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className='w-4 mr-4 sm:w-5 cursor-pointer'
                  src={assets.bin_icon}
                  alt=""
                />
              </div>
            );
          })
        ) : (
          <div className='text-center py-20 border-2 border-gray-200 rounded-lg'>
            <img src={assets.logo} alt="" className='w-1/2 mx-auto mb-4 opacity-50' />
            <p className='text-gray-500 text-lg'>YOUR CART IS EMPTY </p>
          </div>
        )}
      </div>

      {cartData.length >0 && <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => cartData.length > 0 ? navigate('/place-order') : toast.error('Select Product')}
              className='bg-black  text-white text-sm my-8 px-8 py-3'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Cart;
