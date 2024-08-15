'use client'
import React, { useState } from 'react'
import Image from 'next/image'

import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'


const Page = () => {

  const router = useRouter();
  const [errorToast,setErrorToast] = useState(false);

  const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(5, { message: "Password must be at least 5 characters." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  });

  type FormFields = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      username: ""
    },
    resolver: zodResolver(signupSchema)
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    
    try {
      const response = await fetch('/api/signup',{
        method:'POST',
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          username:data.username,
          email:data.email,
          password:data.password
        })
      });
      const res_data = await response.json();
      console.log(res_data);

      if(res_data.success){
        router.replace("/sign-in");
      }

    } catch (error) {
      console.log('Error Registering User',error);
      setErrorToast(true);
    }
  };

  return (
    
      <div className="relative z-10 w-full min-h-screen h-full flex justify-center items-center">
      {errorToast && <Toast title='SignIn Failed' variant='destructive' duration={4} message='Incorrect Username or Password' onClose={()=>setErrorToast(false)}/>}

        <div className='w-[90%] md:w-1/3 rounded-lg text-white p-6 bg-gradient-to-br from-blue-400 to-blue-500'>
          <h1 className='text-3xl font-bold mb-2'>Sign Up</h1>
          <p className='text-sm mb-4'>
          Hop aboard to save your favourite items.
          </p>
          <form className='flex flex-col items-center' onSubmit={handleSubmit(onSubmit)}>
            
            <label htmlFor="username" className='w-full text-start'>Username</label>
            <input
              id="username"
              {...register("username")}
              className={`text-black p-2 my-1 outline-none border-b border-black w-full ${errors.username ? 'border-red-500' : ''}`}
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && <p className='text-red-500 text-sm text-left w-full'>{errors.username.message}</p>}

            <label htmlFor="email" className='w-full text-start mt-2'>Email</label>
            <input
              id="email"
              {...register("email")}
              className={`text-black p-2 my-1 outline-none border-b border-black w-full ${errors.email ? 'border-red-500' : ''}`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p className='text-red-500 text-sm text-left w-full'>{errors.email.message}</p>}

            <label htmlFor="password" className='w-full text-start mt-2'>Password</label>
            <input
              id="password"
              {...register("password")}
              type="password"
              className={`text-black p-2 my-1 outline-none border-b border-black w-full ${errors.password ? 'border-red-500' : ''}`}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && <p className='text-red-500 text-sm text-left w-full'>{errors.password.message}</p>}

            <button
              className='w-full py-2 rounded-sm mt-6 bg-[#fe4463] hover:bg-rose-600'
              type='submit'
              disabled={isSubmitting}
              
            >
              {isSubmitting ? "Signing Up..." : "Let's Go"}
            </button>
            
          </form>
          <p className='text-center mt-4'>
            Already have an account? <Link href='/sign-in' className='font-semibold'>SignIn here</Link>
          </p>
        </div>
      </div>
  
  )
}

export default Page
