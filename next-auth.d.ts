import 'next-auth'
import { DefaultSession } from 'next-auth'
import { ProductType } from './types'

declare module 'next-auth' {
    interface User{
        _id?:string,
        username?:string,
        email:string,
        cart:ProductType[]
    }
    interface Session{
        user:{
            _id?:string,
            username?:string,
            email:string,
            cart:ProductType[]
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string,
        username?:string,
        email:string,
        cart:ProductType[]
    }
}