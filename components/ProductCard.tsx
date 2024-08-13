import Image from 'next/image'
import React from 'react'
import { ProductType } from '@/types'

const ProductCard: React.FC<ProductType> = ({ image, title, description, category, id, price, rating }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative w-full h-48 mb-4">
        <Image 
          src={image} 
          alt={title} 
          layout="fill" 
          objectFit="contain" 
          className="rounded-t-lg"
        />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {/* <p className="text-sm text-gray-500">{description}</p> */}
        <p className="text-sm text-blue-500 mt-2">{category}</p>
        <p className="text-lg font-bold text-green-500 mt-2">${price}</p>
        <div className="flex items-center justify-center mt-2">
          <span className="text-yellow-500 mr-2">{rating.rate}⭐</span>
          <span className="text-sm text-gray-600">({rating.count} reviews)</span>
        </div>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
