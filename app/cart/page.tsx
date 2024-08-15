// /app/cart/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ProductType } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { FileWarning, Loader2, Trash2 } from 'lucide-react';
import Toast from '@/components/Toast';

const CartPage = () => {
  const { data: session } = useSession();
  const { cart,setCart, removeFromCart, updateQuantity, calculateSubtotal } = useCartStore((state) => ({
    cart: state.cart,
    setCart:state.setCart,
    removeFromCart: state.removeFromCart,
    updateQuantity: state.updateQuantity,
    calculateSubtotal: state.calculateSubtotal,
  }));

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [openToast,setOpenToast]=useState(false);
  const [openErrorToast,setOpenErrorToast]=useState(false);

  const fetchUserCart=async()=>{
    setLoading(true);
    try {
      const response = await fetch(`/api/cart/${session?.user?.email}`);
      const data = await response.json();
  
      setCart(data.cart);
      
    } catch (error) {
      console.log("Error fetching user's cart",cart);
      setError(true);
    } finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    // if user is logged in - fetch cart from DB
    if(session?.user){
      fetchUserCart();
    }
    else{ // else fetch cart from local storage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      } else {
        setCart([]); 
        localStorage.setItem('cart', JSON.stringify([])); 
      }
    }
  },[])

  const handleRemove = async (productId: string) => {
    
    if(session?.user){
      try {
        const response = await fetch(`/api/cart/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId, userEmail: session.user.email }),
        });
        const data = await response.json();
        
        if(data.success){
          removeFromCart(productId);
          setOpenToast(true);
        }
        else{
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error removing item from the cart:', error);
        setOpenErrorToast(true);
      }
    }
    else{
      removeFromCart(productId);
      setOpenToast(true);
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    updateQuantity(productId,newQuantity);
  };

  const subtotal = calculateSubtotal();

  if(error){
    return(
      <main className="min-h-screen mt-20 p-4 md:p-8">
        <h1 className="flex items-end text-red-500  gap-2 text-3xl font-bold"> <FileWarning className="h-12 w-12"/> Error 404</h1>
        <h3 className="text-red-500 text-xl font-semibold">There was some error getting this page.</h3>
      </main>
    )
  }

  return (
    <div className="min-h-screen mt-16  md:mt-20 bg-gray-100 p-6 w-full md:w-[90%]">

      {openToast && <Toast variant='success' title='Success' duration={4} message='Item Removed from Cart.' onClose={()=>setOpenToast(false)}/>}
      {openErrorToast && <Toast variant='destructive' title='Failed' duration={4} message='Error Removing item from Cart.' onClose={()=>setOpenErrorToast(false)}/>}

      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {loading && <>
        <div className="flex items-center gap-2 text-2xl">
          <Loader2 className="w-10 h-10 animate-spin"/>
          Loading...
        </div>
      </>}

      <div className="flex flex-col gap-6">
        <div className="flex-1 flex flex-col">
          {(!loading && cart.length === 0) ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item: ProductType) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between mb-4 bg-white rounded-lg shadow-md p-4">
                <div>
                  <div className="flex items-center">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="rounded object-contain h-24"
                    />
                    <div className="ml-6">
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p className="text-green-600">${item.price}</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="px-2 py-1 text-sm font-bold text-white bg-blue-500 rounded-l"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 text-center border"
                        />
                        <button
                          className="px-2 py-1 text-sm font-bold text-white bg-blue-500 rounded-r"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center gap-2 mt-3 md:mt-0 border-t pt-3 md:pt-0 md:border-none border-gray-300 justify-end w-full md:w-fit"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove 
                  <Trash2 className='h-5 w-5'/>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>

          {/* Subtotal */}
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Subtotal</p>
            <p className="text-gray-800 font-semibold">${subtotal.toFixed(2)}</p>
          </div>

          {/* Discount */}
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Discount (10%)</p>
            <p className="text-gray-800 font-semibold">-${(subtotal * 0.10).toFixed(2)}</p>
          </div>

          {/* Total */}
          <div className="flex justify-between mb-6">
            <p className="text-gray-600">Total</p>
            <p className="text-gray-800 font-semibold">
              ${ (subtotal - subtotal * 0.10).toFixed(2) }
            </p>
          </div>

          <button 
            disabled={cart.length===0}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
