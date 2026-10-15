import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";


import { toast } from "react-toastify";
import LoadingProducts from "./LoadingProducts";
import LoadingReviews from "./LoadingReviews";
import { useTranslation } from "../context/LanguageContext";

const Product = () => {
  const { t } = useTranslation();
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, loading, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState('');
  const [showReview, setShowReview] = useState(false);


  // States for reviews
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id == productId) {
        setSize('');
        setUserRating(0);
        setReviewComment("");
        setShowReviewForm(false);
        setProductData(item);
        setImage(item.image[0]);

        return null;
      }
    });


  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/review/product",
        { productId }
      );

      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setReviewsLoading(false);
    }
  };


  const submitReview = async () => {

    if (!token) {
      toast.error(t('toast.pleaseLogin'));
      return;
    }

    if (userRating === 0) {
      toast.error(t('toast.selectRating'));
      return;
    }

    if (!reviewComment.trim()) {
      toast.error(t('toast.writeComment'));
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/review/add", {
        productId,
        rating: userRating,
        comment: reviewComment,
      },
        {
          headers: {
          },
        }
      );

      if (data.success) {
        setShowReviewForm(false);
        setUserRating(0);
        setReviewComment("");
        fetchReviews();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(t('toast.errorSubmitting'));
    }
  };


  useEffect(() => {
    fetchProductData();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [productId, products]);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <img
        key={star}
        src={star <= rating ? assets.star_icon : assets.star_dull_icon}
        alt=""
        className="w-3 5"
      />
    ));
  };

  return loading ? (
    // Skeleton Loading State
    <LoadingProducts showReview={showReview} totalReviews={totalReviews} />
  ) : productData ? (
    // Actual Product Data
    <div className="border-t-1 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*------- product data ------*/}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*------- product images------ */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex flex-wrap sm:flex-col overflow-x-auto sm:overflow-y-scroll gap-2 justify-normal sm:w-[18.7%] w-full">
            {productData.image && productData.image.length > 0 ? (
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[23%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt={item.name}
                />
              ))
            ) : (
              <div className="w-[23%] sm:w-full sm:mb-3 aspect-[3/4] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-gray-500 text-xs text-center px-1">{t('common.noImage')}</span>
              </div>
            )}
          </div>
          <div className="w-full sm:w-[88%] relative ">
            {/* Bestseller badge */}
                        {productData.bestseller && (
                          <div className="absolute top-2 left-2 w-14 h-14 z-10">
            
                            {/* Original PNG */}
                            <img
                              src={assets.bestseller}
                              alt={assets.bestseller}
                              className="relative w-full h-full"
                            />
                          </div>
                        )}
            {productData.image && productData.image.length > 0 ? (
              <img className="w-full h-auto" src={image} alt="" />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-gray-500 text-sm text-center px-4">{t('common.productWithoutImage')}</span>
              </div>
            )}
          </div>
        </div>

        {/* ----------- product info --------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(Math.round(averageRating))}
            <p className="pl-2">({totalReviews})</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>{t('product.selectSize')}</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border  py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black  text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            {t('product.addToCart')}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>{t('product.originalProduct')}</p>
            <p>{t('product.codAvailable')}</p>
            <p>{t('product.easyReturn')}</p>
          </div>
        </div>
      </div>

      {/* -----------------Description & review section -------------- */}
      <div className="mt-20">
        <div className="flex ">
          <p onClick={() => setShowReview(false)} className={`border px-5 py-3 text-sm cursor-pointer  ${showReview ? '' : 'font-semibold'}`}>{t('product.description')}</p>
          <p onClick={() => setShowReview(true)} className={`border px-5 py-3 text-sm cursor-pointer ${showReview ? 'font-semibold' : ''}`}>{t('product.reviews', { count: totalReviews })}</p>

        </div>
        {
          showReview ?
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 overflow-y-scroll h-80">

              {/* ---------------------------------------------------------------------------------------------- R E V I E W ------------------------------------------------------------------------------------- */}
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-black  text-white px-8 py-3 text-sm active:bg-gray-700 w-fit"
              >
                {t('product.addReview')}
              </button>

              {/* Review Form */}
              {showReviewForm && (
                <div className="border p-4 mb-4  ">
                  <h4 className="font-medium mb-3">{t('product.writeReview')}</h4>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <img
                        key={star}
                        src={star <= userRating ? assets.star_icon : assets.star_dull_icon}
                        alt=""
                        className="w-5 cursor-pointer"
                        onClick={() => setUserRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t('product.placeholder')}
                    className="w-full border p-3 text-sm h-24 resize-none"
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={submitReview}
                      className="bg-black text-white px-6 py-2 text-sm"
                    >
                      {t('product.submitReview')}
                    </button>
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setUserRating(0);
                        setReviewComment("");
                      }}
                      className="border border-gray-300 px-6 py-2 text-sm"
                    >
                      {t('product.cancel')}
                    </button>
                  </div>
                </div>
              )}
              {/* ---------------------------------------------------------------------------------------------- R E V I E W ------------------------------------------------------------------------------------- */}

              {/* Reviews List */}
              {reviewsLoading ? (
                <LoadingReviews />
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="gap-10 border p-4">
                    <div className="ml-4 py-2 gap-2 sm:gap-0 grid items-start grid-cols-[1fr_7fr]">
                      <img className="h-5 sm:h-10 " src={assets.profile_icon} alt="" />
                      <div className="">
                        <p className="font-medium">{review.userName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-gray-500 text-sm ml-2">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 gap-2 sm:gap-0 py-2 grid grid-cols-[1fr_7fr]">
                      <div></div>
                      <p className="text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center my-auto ">{t('product.noReviews')}</p>
              )}
            </div>
            :
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 overflow-y-scroll h-80">
              <p>{t('product.descPlaceholder1')}</p>
              <p>{t('product.descPlaceholder2')}</p>
            </div>
        }

        {/* --------- display related products ----------------------- */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  ) : (
    // Product Not Found
    <div className='text-center py-20 border-2 border-gray-200 rounded-lg'>
      <img src={assets.logo} alt="" className='w-1/2 mx-auto mb-4 opacity-50' />
      <p className='text-gray-500 text-lg'>{t('product.productNotFound')}</p>
    </div>
  );
};

export default Product;