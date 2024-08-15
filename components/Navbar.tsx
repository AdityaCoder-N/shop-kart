'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { X,Menu, ShoppingBag, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const Navbar = () => {

  const {data:session} = useSession();
  const { cart } = useCartStore((state)=>({
    cart:state.cart
  }))

  const user:User = session?.user as User;

  const [showMenu,setShowMenu] = useState(false);
  const [initialCartCount, setInitialCartCount] = useState(0);

  const fetchCartCount=async()=>{
    try {
      const response = await fetch(`/api/cart/count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: session?.user?.email }),
      });
      const data = await response.json();

      if (data.success) {
        setInitialCartCount(data.count); 
      }
    } catch (error) {
      console.log("Error fetching cart count",error);
    }
  }

  useEffect(()=>{

    if (session?.user?.email) {
      fetchCartCount();
    }
    else{
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setInitialCartCount((JSON.parse(localCart)).length);
      } else {
        setInitialCartCount(0);
      }
    }

  },[])

  const cartItemCount = cart.length > 0 ? cart.length : initialCartCount;

  return (
    <nav className='bg-blue-600 py-4 w-full px-6 md:px-12 fixed top-0 z-50 shadow-md'>
        <div className='flex justify-between items-center text-white'>

          <a className='text-2xl font-bold font-grotesk flex items-center' href="/">ShopKar <span className='text-[#fe4463]'>t</span></a>

          <div className='hidden md:flex items-center justify-between gap-8 w-fit font-sofia text-lg'>
            <Link href="/">Home</Link>
            <a href="https://aditya-negi-portfolio.vercel.app/" target='_blank'>About Developer</a>
            <Link href="/cart" className='flex gap-2 items-center relative'>
              <span>Cart</span>
              <ShoppingBag className='h-6 w-6'/>
              <span className='p-1 rounded-full text-white bg-[#ea4d67] absolute -top-2 -right-2 text-xs text-center h-5 w-5'>{cartItemCount}</span>
            </Link>
          </div>
          {
            session? (
              
              <button className='hidden font-sofia text-lg md:flex w-full md:w-auto items-center gap-2' onClick={()=>signOut({callbackUrl:'/'})}>
                Logout
                <LogOut className='h-5 w-5'/>
              </button>
              
            ) : (
              <Link href='/sign-in'>
                  <button className='hidden md:block w-full md:w-auto font-semibold'>Login</button>
              </Link>
            )
          }

          <Menu className='md:hidden h-6 w-6' onClick={()=>setShowMenu(true)}/>
          
          <div onClick={(e)=>e.stopPropagation()} className={`fixed top-0 left-0 bg-gradient-to-br from-[#da3c56] to-[#9b3244] h-[100vh] ${showMenu?'w-3/4':'w-0'} z-50 transition-all`}>
            <div className={`${showMenu?'flex':'hidden'} flex-col items-center justify-center gap-8 font-sofia text-lg h-full`}>

              <Link href="/">Home</Link>

              <a href="https://aditya-negi-portfolio.vercel.app/" target='_blank'>About Developer</a>

              <Link href="/cart" className='flex gap-2 items-center relative'>
                <span>Cart</span>
                <ShoppingBag className='h-6 w-6'/>
                <span className='p-1 rounded-full text-white bg-teal-500 absolute -top-2 -right-2 text-xs text-center h-5 w-5'>{cartItemCount}</span>
              </Link>
              {
                session? (
                  <>
                    <span className='w-auto' onClick={()=>signOut({callbackUrl:'/'})}>LogOut</span>
                  </>
                ) : (
                  <>
                    <Link href='/sign-in'>
                        <p className='w-auto text-white'>Login</p>
                    </Link>
                  </>
                )
              }

              <X className='h-7 w-7 cursor-pointer' onClick={()=>setShowMenu(false)}/>
            </div>
          </div>
          
        </div>
    </nav>
  )
}

export default Navbar