'use client';
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/types";
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
      />
    ));
  }, [products]);

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-xl">
        {memoizedProducts}
      </div>
    </main>
  );
}
