'use client';
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/types";
import { FileWarning, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";

export default function Home() {

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);

  const fetchProducts = useCallback(async () => {

    setLoading(true);
    try {

      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);

    } catch (error) {

      console.log("Error in Fetching data:",error);
      setError(true);

    } finally{
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const memoizedProducts = useMemo(() => {
    return products.map((product: ProductType) => (
      <ProductCard
        key={product.id}
        id={product.id}
        title={product.title}
        image={product.image}
        description={product.description}
        price={product.price}
        category={product.category}
        rating={product.rating}
        quantity={1}
      />
    ));
  }, [products]);

  if(error){
    return(
      <main className="min-h-screen mt-20 p-4 md:p-8">
        <h1 className="flex items-end text-red-500  gap-2 text-3xl font-bold"> <FileWarning className="h-12 w-12"/> Error 404</h1>
        <h3 className="text-red-500 text-xl font-semibold">There was some error getting this page.</h3>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center min-h-screen mt-20 p-4 md:p-8 ">

      {loading && <>
        <div className="flex items-center gap-2 text-2xl">
          <Loader2 className="w-10 h-10 animate-spin"/>
          Loading...
        </div>
      </>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        {memoizedProducts}
      </div>
    </main>
  );
}
