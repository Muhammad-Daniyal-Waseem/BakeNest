import React, { createContext, useState } from "react";

const ProductContext = createContext();

const ProductProvider = (props) => {
  const host = "http://localhost:3000";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const getProducts = async () => {
    try {
      const url = `${host}/getProducts`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw "Something went wrong";
      } else {
        const json = await response.json();
        return json;
      }
    } catch (error) {
      console.log("error occurred:", error);
      return "error";
    }
  };

  const getProductsBySearch = async () => {
    try {
      const url = `${host}/search?q=${encodeURIComponent(searchQuery)}`;
      console.log(url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw "Something went wrong";
      } else {
        const json = await response.json();
        return json;
      }
    } catch (error) {
      console.log("error occurred:", error);
      return "error";
    }
  };

  const [object, setObject] = useState({})

  return (
    <ProductContext.Provider
      value={{
        host,
        getProducts,
        getProductsBySearch,
        searchQuery,
        setSearchQuery,
        searchResult,
        setSearchResult,
        object,
        setObject
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
