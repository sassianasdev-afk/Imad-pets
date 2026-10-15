import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LatestCollection = () => {
  const { products,loading } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  
  useEffect(() => {
    if (products.length > 0 ) {

      // hide bestseller
      // const filtring = products.filter(item => item.bestseller != true);


      setLatestProducts(products.reverse().slice(0,10));
    } 
    

  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Step into the world of Imad Pets' latest collection, where quality meets care. Discover our newest pet food, toys, accessories, and grooming products, crafted to bring health, happiness, and comfort to your furry friends. Refresh your pet's life with products that are both modern and reliable, perfect for every occasion.
        </p>
      </div>

      {/* rendering products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {loading ? (
          Array(10).fill(0).map((_, index) => (
            <div key={index}>
              <Skeleton className="w-full aspect-square" />
              <Skeleton count={1} height={16} className="mt-3" />
              <Skeleton count={1} height={16} width="60%" className="mt-2" />
            </div>
          ))
        ) : (
          latestProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} bestseller={item.bestseller} />
          ))
        )}
      </div>
    </div>
  );
};

export default LatestCollection;
