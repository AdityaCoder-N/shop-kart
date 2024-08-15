import { create } from "zustand";
import { ProductType } from "@/types";

interface CartStore {
  cart: ProductType[];
  setCart:(products:ProductType[])=>void;
  addToCart:(product:ProductType)=>void;
  removeFromCart:(productId:string)=>void;
  updateQuantity:(productId:string,quantity:number)=>void;
  calculateSubtotal:()=>number
}

export const useCartStore = create<CartStore>((set,get) => ({
  
  cart: [],

  setCart:(products:ProductType[])=>{
    set((state)=>{
      return {cart:products}
    })
  },
  addToCart: (product:ProductType)=>{
    set((state)=>{
      const itemExists = state.cart.some((item)=>String(item.id)===String(product.id));
      if(itemExists){
        return {cart:state.cart}
      }
      else{
        const updatedCart = [...state.cart,product];
        localStorage.setItem('cart',JSON.stringify(updatedCart));
        return {cart:updatedCart}
      }
    })
  },
  removeFromCart:(productId:string)=>{
    set((state)=>{
      const itemExists = state.cart.some((item)=>String(item.id)===String(productId));
      if(!itemExists){
        return {cart:state.cart}
      }
      else{
        const updatedCart = state.cart.filter((item)=>String(item.id)!==String(productId));
        localStorage.setItem('cart',JSON.stringify(updatedCart));
        return {cart:updatedCart}
      }
    })
  },
  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      const itemExists = state.cart.some((item)=>String(item.id)===String(productId));
      if(!itemExists){
        return {cart:state.cart}
      }
      const updatedCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity:Number(quantity) } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    });
  },
  calculateSubtotal: () => {
    const cart = get().cart;
    return cart.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity || 1),
      0
    );
  },
  
}));
