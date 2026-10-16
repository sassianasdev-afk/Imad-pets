import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Doughnut, Bar, Pie } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { assets } from '../assets/admin_assets/assets'
import { useTranslation } from '../context/LanguageContext'

// Register chart.js controllers so react-chartjs-2 components can render
Chart.register(...registerables)

const toTitleCase = (str) => {
  if (!str) return str
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Admin panel colors (same as the rest of the admin)
const PRIMARY = '#000000'        // black
const ACCENT = '#c586a5'         // main admin color
const SECONDARY = '#e2e0b0'      // second admin color
const GRAY = '#c2c2c2'
const TEXT_GRAY = '#6b7280'

const CHART_COLORS = [PRIMARY, ACCENT, SECONDARY, GRAY, '#4b5563', '#9ca3af']

const Home = () => {
  const { t } = useTranslation()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Computed statistics
  const totalProducts = products.length
  const bestsellersCount = products.filter((p) => p.bestseller).length
  const regularCount = totalProducts - bestsellersCount

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  const categories = Object.keys(categoryCounts)
  const categoryValues = Object.values(categoryCounts)

  const subCategoryCounts = products.reduce((acc, p) => {
    acc[p.subCategory] = (acc[p.subCategory] || 0) + 1
    return acc
  }, {})
  const subCategories = Object.keys(subCategoryCounts)
  const subCategoryValues = Object.values(subCategoryCounts)

  const priceRanges = {
    '0 - 100': 0,
    '101 - 300': 0,
    '301 - 600': 0,
    '601 +': 0,
  }
  products.forEach((p) => {
    const price = Number(p.price)
    if (price <= 100) priceRanges['0 - 100']++
    else if (price <= 300) priceRanges['101 - 300']++
    else if (price <= 600) priceRanges['301 - 600']++
    else priceRanges['601 +']++
  })

  const fetchProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <img src={assets.logo} alt='' className='w-32 mb-4 opacity-50 animate-pulse' />
          <p className='text-gray-500'>{t('home.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 text-gray-600'>
      {/* Header */}
      <div className='px-6 py-8 border-b border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-black'>{t('home.title')}</h1>
            <p className='text-sm text-gray-500 mt-1'>{t('home.subtitle')}</p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={fetchProducts}
              className='px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              {t('home.refresh')}
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Key metrics */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>{t('home.totalProducts')}</p>
            <p className='text-3xl font-bold text-black mt-1'>{totalProducts}</p>
          </div>
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>{t('home.bestsellers')}</p>
            <p className='text-3xl font-bold text-black mt-1'>{bestsellersCount}</p>
          </div>
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>{t('home.categories')}</p>
            <p className='text-3xl font-bold text-black mt-1'>{categories.length}</p>
          </div>
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>{t('home.subCategories')}</p>
            <p className='text-3xl font-bold text-black mt-1'>{subCategories.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10'>
          {/* Bestsellers vs Regular - Pie */}
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <h3 className='text-lg font-bold text-black mb-6'>{t('home.bestsellerVsRegular')}</h3>
            <div className='h-64 w-full'>
              {totalProducts === 0 ? (
                <p className='text-gray-500 text-center mt-10'>{t('home.noData')}</p>
              ) : (
                <Pie
                  data={{
                    labels: [t('home.bestseller'), t('home.regular')],
                    datasets: [
                      {
                        label: t('home.products'),
                        data: [bestsellersCount, regularCount],
                        backgroundColor: [ACCENT, GRAY],
                        borderColor: ['#fff', '#fff'],
                        borderWidth: 3,
                        hoverOffset: 20,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { color: TEXT_GRAY, font: { family: 'Outfit' } } },
                      title: { display: false },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Products by Category - Doughnut */}
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <h3 className='text-lg font-bold text-black mb-6'>{t('home.productsByCategory')}</h3>
            <div className='h-64 w-full'>
              {categories.length === 0 ? (
                <p className='text-gray-500 text-center mt-10'>{t('home.noData')}</p>
              ) : (
                <Doughnut
                  data={{
                    labels: categories.map((c) => toTitleCase(c)),
                    datasets: [
                      {
                        label: t('home.products'),
                        data: categoryValues,
                        backgroundColor: CHART_COLORS.slice(0, categories.length),
                        borderColor: ['#fff', ...CHART_COLORS.slice(0, categories.length - 1)],
                        borderWidth: 3,
                        hoverOffset: 20,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: { position: 'right', labels: { color: TEXT_GRAY, font: { family: 'Outfit' } } },
                      title: { display: false },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Products by SubCategory - Bar */}
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <h3 className='text-lg font-bold text-black mb-6'>{t('home.productsBySubCategory')}</h3>
            <div className='h-64 w-full'>
              {subCategories.length === 0 ? (
                <p className='text-gray-500 text-center mt-10'>{t('home.noData')}</p>
              ) : (
                <Bar
                  data={{
                    labels: subCategories.map((s) => toTitleCase(s)),
                    datasets: [
                      {
                        label: t('home.products'),
                        data: subCategoryValues,
                        backgroundColor: CHART_COLORS.slice(0, subCategories.length),
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: TEXT_GRAY, font: { family: 'Outfit' } },
                        grid: { color: '#f3f4f6' },
                      },
                      x: {
                        ticks: { color: TEXT_GRAY, font: { family: 'Outfit' } },
                        grid: { display: false },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Price Range - Bar */}
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <h3 className='text-lg font-bold text-black mb-6'>{t('home.priceRange')}</h3>
            <div className='h-64 w-full'>
              {totalProducts === 0 ? (
                <p className='text-gray-500 text-center mt-10'>{t('home.noData')}</p>
              ) : (
                <Bar
                  data={{
                    labels: Object.keys(priceRanges),
                    datasets: [
                      {
                        label: t('home.products'),
                        data: Object.values(priceRanges),
                        backgroundColor: [PRIMARY, ACCENT, SECONDARY, GRAY],
                        borderRadius: 6,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: TEXT_GRAY, font: { family: 'Outfit' } },
                        grid: { color: '#f3f4f6' },
                      },
                      x: {
                        ticks: { color: TEXT_GRAY, font: { family: 'Outfit' } },
                        grid: { display: false },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
