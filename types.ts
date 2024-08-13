export interface ProductType{
    image:string,
    title:string,
    description:string,
    id:string,
    price:string,
    category?:string,
    rating:{
        count:number,
        rate:string
    }
}