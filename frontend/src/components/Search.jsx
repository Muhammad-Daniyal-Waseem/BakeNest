import React, { useContext, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import FilterBadge from "./FilterBadge";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider"; // https://mui.com/material-ui/react-slider/
import { ProductContext } from "../context/ProductContext";
import Header from "./Header";
import Carousel from "./Carousel";

export default function Search() {
  const { searchResult, searchQuery } = useContext(ProductContext);
  const [price, setPrice] = useState([0, 5000]);
  const [rating, setRating] = useState([0, 5]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(false);

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  useEffect(() => {
    setPriceFilter(false);
    setFilteredProducts(searchResult);
  }, [searchResult]);

  const setStartPrice = (event) => {
    const startPrice = parseInt(event.target.value);
    setPrice([startPrice, price[1]]);
  };

  const setEndPrice = (event) => {
    const endPrice = parseInt(event.target.value);
    setPrice([price[0], endPrice]);
  };

  const renderProduct = (products) => {
    return (
      <>
        {products.map((product) => (
          <ProductCard
            key={product.ID}
            image={product.Image}
            name={product.Name}
            description={product.Description}
            price={product.Price}
            rating={product.Rating}
          />
        ))}
      </>
    );
  };

  const applyFilter = () => {
    if (price[0] < price[1] && price[0] >= 0 && price[1] <= 5000) {
      const filtered = searchResult.filter(
        (product) =>
          product.Price >= price[0] &&
          product.Price <= price[1] &&
          product.Rating >= rating[0] &&
          product.Rating <= rating[1]
      );
      setPriceFilter(true);
      setRatingFilter(true);
      setFilteredProducts(filtered);
    } else {
      setPrice([0, 5000]);
    }
  };

  const clearPriceFilter = () => {
    setPrice([0, 5000]);
    const filtered = searchResult.filter(
      (product) =>
        product.Price >= 0 &&
        product.Price <= 5000 &&
        product.Rating >= rating[0] &&
        product.Rating <= rating[1]
    );
    setFilteredProducts(filtered);
    setPriceFilter(false);
  };

  const clearRatingFilter = async () => {
    await setRating([0, 5]);
    const filtered = searchResult.filter(
      (product) =>
        product.Price >= price[0] &&
        product.Price <= price[1] &&
        product.Rating >= 0 &&
        product.Rating <= 5
    );
    setFilteredProducts(filtered);
    setRatingFilter(false);
  };

  return (
    <>
      <Header />
      <Carousel />
      <div className="mx-4">
        {filteredProducts.length !== 0 && (
          <h5 className="text-4xl mt-4">
            {filteredProducts.length} Result(s) for "{searchQuery}"
          </h5>
        )}
        {filteredProducts.length === 0 && (
          <h5 className="text-4xl mt-4">
            No Result(s) found
          </h5>
        )}
        <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700" />
      </div>

      <div className="flex my-2">
        {/* Filter Sidebar */}
        <div className="text-zinc-700  overflow-y-auto w-4/12 sm:w-4/12 md:w-2/12 lg:w-2/12 border-r border-zinc-700">
          <div className="flex p-4 justify-between">
            <h1 className="text-2xl font-semibold">Filter</h1>
            <img className="w-8" src="/filter-svg.png" alt="filter" srcSet="" />
          </div>
          <div className="p-4">
            <h1 className="text-lg">Price</h1>
            <Box sx={{ width: "94%" }}>
              <Slider
                min={0}
                max={5000}
                step={100}
                value={price}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                sx={{
                  color: "#4ADE80",
                }}
              />
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Start Price
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={price[0]}
                  placeholder="Start Price"
                  onChange={setStartPrice}
                />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  End Price
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={price[1]}
                  placeholder="End Price"
                  onChange={setEndPrice}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      applyFilter();
                    }
                  }}
                />
              </div>
            </Box>
            <h1 className="text-lg mt-4">Rating</h1>
            <Box sx={{ width: "94%" }}>
              <Slider
                min={0}
                max={5}
                step={1}
                value={rating}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                sx={{
                  color: "#FBBF24",
                }}
              />
            </Box>
            <a
              className="flex flex-row items-center justify-center w-full px-4 py-4 mb-4 my-2 text-sm font-bold bg-blue-300 leading-6 capitalize duration-100 transform rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none sm:mb-0 sm:w-auto sm:mr-4 md:pl-8 md:pr-6 xl:pl-12 xl:pr-10   hover:shadow-lg hover:-translate-y-1"
              onClick={applyFilter}
            >
              Apply Filter
              <span className="ml-4 w-4">
                <img src="/filter-svg.png" alt="" />
              </span>
            </a>
          </div>
        </div>

        {/* Products */}
        <div className="w-8/12 sm:w-8/12 md:w-10/12 lg:w-10/12 ">
          <FilterBadge
            name={"Price"}
            filter={priceFilter}
            clearFilter={clearPriceFilter}
            color={"green"}
          />
          <FilterBadge
            name={"Rating"}
            filter={ratingFilter}
            clearFilter={clearRatingFilter}
            color={"amber"}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {renderProduct(filteredProducts)}
          </div>
        </div>
      </div>
    </>
  );
}
