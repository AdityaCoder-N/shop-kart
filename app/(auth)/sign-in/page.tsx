'use client'
import React from 'react'
import Image from 'next/image'

import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'


const Page = () => {

  const router = useRouter();

  const signinSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(5, { message: "Password must be at least 5 characters." })
  });

  type FormFields = z.infer<typeof signinSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(signinSchema)
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const {email,password} = data;
    try {
      const result = await signIn('credentials',{
        redirect:false,
        email:email,
        password:password
      })
      console.log(result);
  
      if(result?.error){
        // toast({
        //   title:'Login Failed',
        //   description:"Incorrect Username or Password",
        //   variant:"destructive"
        // })
      }
  
      if(result?.url){
        router.replace('/home');
      }

    } catch (error) {
      console.log('Error Loggin in User',error);
      // toast({
      //   title:'Log In Failed',
      //   description:"Incorrect Username or Password",
      //   variant:'destructive'
      // })
    }
  };

  return (
    <div className='min-h-screen w-full relative'>
      
      <div className="relative z-50 w-full min-h-screen h-full flex justify-center items-center font-minecraft">

        <Link href='/' className="absolute top-6 left-8 text-lg  font-poxast font-semibold text-white">
          Keyboard Warriors
        </Link>

        <div className='w-1/3 p-6 bg-gradient-to-br from-[#b9d2e1] to-[#6b8595]'>
          <h1 className='text-3xl font-bold mb-2'>Sign In</h1>
          <p className='text-sm mb-4'>
            Ready for some action? Easy there, mate, you&apos;re just gonna type, not fight a dragon to save your girl.
          </p>
          <form className='flex flex-col items-center' onSubmit={handleSubmit(onSubmit)}>
            
            <label htmlFor="email" className='w-full text-start mt-2'>Email</label>
            <input
              id="email"
              {...register("email")}
              className={`p-2 my-1 outline-none border-b border-black w-full ${errors.email ? 'border-red-500' : ''}`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p className='text-red-500 text-sm text-left w-full'>{errors.email.message}</p>}

            <label htmlFor="password" className='w-full text-start mt-2'>Password</label>
            <input
              id="password"
              {...register("password")}
              type="password"
              className={`p-2 my-1 outline-none border-b border-black w-full ${errors.password ? 'border-red-500' : ''}`}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && <p className='text-red-500 text-sm text-left w-full'>{errors.password.message}</p>}

            <button
              className='w-full mt-6 text-white'
              type='submit'
              disabled={isSubmitting}
              // bg='#6A7BA2'
              // shadow='#4E5C79'
            >
              {isSubmitting ? "Signing In..." : "Let's Go"}
            </button>

          </form>

          <p className='text-center mt-4'>
            Don&apos;t have an account yet? <Link href='/sign-up' className='font-semibold'>Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
