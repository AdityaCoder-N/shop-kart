'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { ProductType } from '@/types'
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import Toast from './Toast';


const ProductCard = ({ image, title, description, category, id, price, rating, quantity }:ProductType) => {

  const {data:session} = useSession();
  const addToCart = useCartStore((state) => state.addToCart); 

  const [openToast,setOpenToast]=useState(false);
  const [openErrorToast,setOpenErrorToast]=useState(false);

  const handleAddToCart = async () => {

    if(session?.user){
      try {
        const response = await fetch(`/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userEmail: session?.user?.email,
            product:{
              image,title,description,category,id,price,rating,quantity
            }
          }),
        });
        const data = await response.json();

        if (data.success) {
          addToCart({ image, title, description, category, id, price, rating, quantity });
          setOpenToast(true);
        } 
        else{
          throw new Error(data.message)
        }
        
      } catch (error) {
        console.log("Error adding item to cart",error);
        setOpenErrorToast(true);
      }
    }
    else{
      addToCart({ image, title, description, category, id, price, rating, quantity });
      setOpenToast(true);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-5 max-w-sm mx-auto hover:shadow-xl transition-shadow duration-200 ease-in-out w-full flex flex-col h-full">

      {openToast && <Toast title='Added to Cart' variant='success' duration={4} message='Item added to cart successfully' onClose={()=>setOpenToast(false)}/>}
      {openErrorToast && <Toast title='Already in Cart' variant='destructive' duration={4} message='Product already exists in cart.' onClose={()=>setOpenErrorToast(false)}/>}

      <div className="relative w-full h-48 mb-4">
        <Image 
          src={image} 
          alt={title} 
          layout='fill'
          objectFit="contain" 
          className="rounded-lg z-0"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 font-sofia">{title}</h2>
        <p className="text-sm text-blue-500 mt-2">{category}</p>
      </div>
      <div className='mt-2'>
        <div className='flex justify-between items-center'>
          <p className="text-lg font-bold text-green-500">${price}</p>
          <div className="flex items-center">
            <span className="text-xs text-yellow-500 mr-2">{rating.rate}⭐</span>
            <span className="text-xs text-gray-600">({rating.count} reviews)</span>
          </div>
        </div>
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-[#fe4463] text-white py-2 px-4 rounded-lg hover:bg-[#a92e43] transition-colors duration-200">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
