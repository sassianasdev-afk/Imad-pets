import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BestSeller = () => {
  const { products,loading } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  

  useEffect(() => {
    if (products.length > 0) {
    
      // Filter bestsellers
      const bestProducts = products.filter(item => item.bestseller);

      // Shuffle the array
      const shuffled = bestProducts.sort(() => 0.5 - Math.random());

      // Take 5 random products
      setBestSeller(shuffled.reverse().slice(0, 5));
      
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'BEST'} text2={'SELLERS'}/>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Our best-selling products reflect the trust of our customers and the quality of our brand. Choose from pieces that everyone loves.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {loading ? (
          Array(5).fill(0).map((_, index) => (
            <div key={index}>
              <Skeleton className="w-full aspect-square" />
              <Skeleton count={1} height={16} className="mt-3" />
              <Skeleton count={1} height={16} width="60%" className="mt-2" />
            </div>
          ))
        ) : (
          bestSeller.map((item, index) => (
            <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} bestseller={item.bestseller} />
          ))
        )}
      </div>
    </div>
  );
};

export default BestSeller;