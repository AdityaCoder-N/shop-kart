'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { X,Menu } from 'lucide-react'

const Navbar = () => {

  const {data:session} = useSession();

  const user:User = session?.user as User;

  const [showMenu,setShowMenu] = useState(false);

  return (
    <nav className='bg-blue-600 h-[10vh] py-4 w-full px-6 md:px-12 sticky'>
        <div className='flex justify-between items-center text-white'>
            <a className='text-2xl font-bold font-grotesk' href="/">ShopKart</a>
            <div className='hidden md:flex justify-between gap-8 w-fit font-sofia text-lg'>
              <Link href="/">Home</Link>
              <a href="https://aditya-negi-portfolio.vercel.app/" target='_blank'>About Developer</a>
              <a href="mailto:negiaditya1234@gmail.com">Contact</a>
            </div>
            {
              session? (
                <div className='flex items-center gap-6'>
                  <button className='hidden md:block w-full md:w-auto' onClick={()=>signOut({callbackUrl:'/'})}>LogOut</button>
                </div>
              ) : (
                <Link href='/sign-in'>
                    <button className='hidden md:block w-full md:w-auto bg-teal-600'>Login Here</button>
                </Link>
              )
            }

            <Menu className='md:hidden h-6 w-6' onClick={()=>setShowMenu(true)}/>
            
              <div onClick={(e)=>e.stopPropagation()} className={`fixed top-0 left-0 bg-gradient-to-r from-teal-500 to-teal-800 h-[100vh] ${showMenu?'w-3/4':'w-0'} z-50 transition-all`}>
                <div className={`${showMenu?'flex':'hidden'} flex-col items-center justify-center gap-8 font-sofia text-lg h-full`}>
                <Link href="/">Home</Link>
                <a href="https://aditya-negi-portfolio.vercel.app/" target='_blank'>About Developer</a>
                <a href="mailto:negiaditya1234@gmail.com">Contact</a>
                  {
                    session? (
                      <>
                        <Link href='/dashboard'>Dashboard</Link>
                        <span className='w-auto bg-teal-600' onClick={()=>signOut({callbackUrl:'/'})}>LogOut</span>
                      </>
                    ) : (
                      <>
                        <Link href='/sign-in'>
                            <p className='w-auto text-white'>Login Here</p>
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