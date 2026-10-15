import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CollectionBox from '../components/CollectionBox';

const Collection = () => {
  const { products, search, showSearch, getProductsData, loading } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Scroll top smooth on page change
  const [prevPage, setPrevPage] = useState(1);
  useEffect(() => {
    if (currentPage !== prevPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPrevPage(currentPage);
    }
  }, [currentPage, prevPage]);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1); // Reset page on filter change
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Pagination calculations
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);
  const paginatedProducts = filterProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 py-10 border-t'>

        {/* filter options */}
        <div className='min-w-60'>
          <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center gap-2 cursor-pointer'>
            FILTERS
            <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
          </p>

          {/* category filter */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                <input className='w-3 accent-black' type="checkbox" value={'Dogs'} onChange={toggleCategory} />Dogs
              </p>
              <p className='flex gap-2'>
                <input className='w-3 accent-black' type="checkbox" value={'Cats'} onChange={toggleCategory} />Cats
              </p>
              <p className='flex gap-2'>
                <input className='w-3 accent-black' type="checkbox" value={'Birds'} onChange={toggleCategory} />Birds
              </p>
            </div>
          </div>

          {/* subcategory filter */}
          <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>TYPE</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                <input className='w-3 accent-black' type="checkbox" value={'Animal'} onChange={toggleSubCategory} />Animal
              </p>
              <p className='flex gap-2'>
                <input className='w-3 accent-black' type="checkbox" value={'Accessories'} onChange={toggleSubCategory} />Accessories
              </p>
              <p className='flex gap-2'>
                <input className='w-3 accent-black' type="checkbox" value={'Food'} onChange={toggleSubCategory} />Food
              </p>
              <p className='flex gap-2'>
                <input className='w-3 accent-black' type="checkbox" value={'Drinks'} onChange={toggleSubCategory} />Drinks
              </p>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='flex-1'>
          <div className='flex flex-col-reverse sm:flex-row sm:flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            {/* product sort */}
            <select onChange={(e) => setSortType(e.target.value)} className={`${showFilter ? '' : 'hidden'} mb-5 sm:mb-0 sm:block border py-2 px-3 border-gray-300 text-sm`}>
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Map Products */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {loading ? (
              Array(12).fill(0).map((_, index) => (
                <div key={index}>
                  <Skeleton className="w-full aspect-square" />
                  <Skeleton count={1} height={16} className="mt-3" />
                  <Skeleton count={1} height={16} width="60%" className="mt-2" />
                </div>
              ))
            ) : (
              paginatedProducts.map((item, index) => (
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} bestseller={item.bestseller} />
              ))
            )}
          </div>

          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className='flex justify-center gap-2 mt-6 flex-wrap'>
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors'
              >
                {'<'}
              </button>

              {/* Page Numbers */}
              {(() => {
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
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className='px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors'
              >
                {'>'}
              </button>
            </div>
          )}

        </div>
      </div>
      {/* <CollectionBox /> */}
    </>
  );
};

export default Collection;