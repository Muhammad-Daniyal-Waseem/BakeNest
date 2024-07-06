import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../context/ProductContext";
import Header from "./Header";
import Carousel from "./Carousel";

export default function Popular() {
  const { getProducts } = useContext(ProductContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
        console.log(data.products);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Carousel />
      <div className="mb-4">
        <div className="mx-4">
          <h5 className="text-4xl mt-4">Products</h5>
          <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700"></hr>
        </div>
        {/* <div className="mx-4 flex"> */}``
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Map over the products array and render ProductCard components */}
          {products.map((product) => (
            <ProductCard
              key={product.ID}
              id={product.ID}
              image={product.Image}
              name={product.Name}
              description={product.Description}
              price={product.Price}
              rating={product.Rating}
              quantity={product.Quantity
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
