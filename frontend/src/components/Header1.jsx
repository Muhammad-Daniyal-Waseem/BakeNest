import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

export default function Header1() {
  const { getProductsBySearch, searchQuery, setSearchQuery, setSearchResult } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const search = async () => {
    try {
      const response = await getProductsBySearch();
      setSearchResult(response.product); // Accessing the product array
      navigate('/search');
    } catch (error) {
      console.error(error); // Handle error if any
    }
  };  

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center m-2">
        {/* Logo section */}
        <div className="lg:w-1/6 m-2 lg:m-0">
          <img src="Logo-Final-C.png" alt="Logo" />
        </div>

        {/* Search bar */}
        <div className="border border-gray-300 h-12 rounded-md flex w-full lg:w-4/6 lg:ml-2">
          <div className="w-10/12 m-auto ml-2">
            <input
              type="text"
              name=""
              id=""
              className="w-full focus:outline-none workSans text-sm text-zinc-700 h-11"
              placeholder="I'm shopping for..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={ (event) => {
                if (event.key === "Enter") {
                  search();
                }
              }
            }
            />
          </div>

          <button
            className="w-2/12 bg-gray-300 flex justify-center items-center rounded-r-md coolBeans after:bg-gradient-to-r from-teal-400 to-gray-800 after:rounded-r-md hover:text-white"
            onClick={search}
          >
            <p className="font-bold text-sm workSans">GO</p>
          </button>
        </div>

        {/* Cart icon and login icon */}
        <div className="flex items-center lg:w-1/6">
          <button className="relative inline-flex items-center p-3 text-sm font-medium text-center">
            <img src="cart.png" alt="" className="w-12 lg:w-10" />
            <span className="sr-only">Notifications</span>
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold workSans bg-gray-300 border-2 border-white rounded-full bottom-0 right-3 -end-2">
              0
            </div>
          </button>
          <button className="relative inline-flex items-center px-3 text-sm font-medium text-center">
            <img src="user.png" alt="" className="w-10 lg:w-8" />
            <p className="text-left px-2">
              Log in <br /> Register
            </p>
          </button>
        </div>
      </div>
    </>
  );
}