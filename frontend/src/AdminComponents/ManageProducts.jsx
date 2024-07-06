import React, { useState, useEffect ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
const ManageProducts = () => {
  const { host } = useContext(UserContext);

  const [check,setchecker]=useState(false);

  const host1 = "localhost:3000";
  const [showModal, setShowModal] = useState(false);
  const [Name, setName] = useState("");
  const [Price, setPrice] = useState("");
  const [Description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlightFields, setHighlightFields] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteid, setdeleteid] = useState("");
  const [deletep, setdeletep] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);

  const openEditModal = (id, name, price, des) => {
    setSelectedProduct(id);
    setUpdatedName(name);
    setUpdatedPrice(price);
    setUpdatedDescription(des);
    setShowUpdateModal(true);
  };
  const handledeleteProduct = (id, name) => {
    setdeleteid(id);
    setdeletep(name);
    setshowDeleteModal(true);
    console.log("Notme");
  };
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `http://${host1}/Product/deleteProduct/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      console.log("Product deleted successfully");
      setProducts(products.filter((product) => product.ID !== id));
      setdeleteid("");
      setdeletep("");
      setshowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        navigate("/login");
        return;
      }
      console.log("token", token)
      try {
        const response = await fetch(`http://${host1}/Product/allProducts`);
        if (!response.ok) 
          throw new Error("Failed to fetch products");
          
        const data = await response.json();
        setProducts(data);

        const responseAuth = await axios.post(
          `${host}/auth`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Fetch user data
        const responseGeUser = await axios.post(
          `${host}/getUser`,
          {
            email: responseAuth.data.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

    if(!responseGeUser.data.Admin)
      {
        navigate("/");
return;
      }
      setchecker(true);
        

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      setErrorMessage("");
      setHighlightFields(false);

      if (!Name || !Price || !Description || !image) {
        setErrorMessage("Please fill in all fields and upload an image.");
        setHighlightFields(true); // Highlight fields if error occurs
        return;
      }

      const price = parseFloat(Price);
      if (isNaN(price) || price <= 0) {
        setErrorMessage("Please enter a valid product price.");
        setHighlightFields(true); // Highlight fields if error occurs
        return;
      }

      // Check if the uploaded file is an image
      const imageType = image.type.split("/")[0];
      if (imageType !== "image") {
        setErrorMessage("Please upload an image file.");
        setHighlightFields(true); // Highlight fields if error occurs
        return;
      }

      setErrorMessage("");

      const formData = new FormData();
      formData.append("pname", Name);
      formData.append("price", Price);
      formData.append("pdesc", Description);
      formData.append("image", image); // Append the image file to FormData

      const response = await fetch(`http://${host1}/Product/addproduct`, {
        method: "POST",
        body: formData, // Use FormData instead of JSON.stringify(productData)
      });

      const responseData = await response.json();
      setProducts([...products, responseData.product]); // Add the new product to the existing list
      setName("");
      setPrice("");
      setDescription("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setErrorMessage("");
      setHighlightFields(false);

      if (!updatedName || !updatedPrice || !updatedDescription) {
        const price = parseFloat(updatedPrice);
        if (isNaN(price) || price <= 0) {
          setErrorMessage("Please enter a valid product price.");
          setHighlightFields(true); // Highlight fields if error occurs
          return;
        }
        setErrorMessage("Please fill in all fields.");
        setHighlightFields(true); // Highlight fields if error occurs
        return;
      }

      if (image) {
        const imageType = image.type.split("/")[0];
        if (imageType !== "image") {
          setErrorMessage("Please upload an image file.");
          setHighlightFields(true); // Highlight fields if error occurs
          return;
        }
      }

      setErrorMessage("");

      const formData = new FormData();
      formData.append("productId", selectedProduct);
      formData.append("pname", updatedName);
      formData.append("price", updatedPrice);
      formData.append("pdesc", updatedDescription);
      formData.append("image", image); // Append the new image file to FormData
      console.log(formData);
      const response = await fetch(`http://${host1}/Product/updateProduct`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      console.log("Product updated successfully");

      const responseData = await response.json();
      console.log(responseData.product.Image);
      // Close the modal
      setShowUpdateModal(false);
      const updatedProducts = products.map((product) => {
        if (product.ID === selectedProduct) {
          return {
            ...product,
            Name: updatedName,
            Price: updatedPrice,
            Description: updatedDescription,
            Image: responseData.product.Image !== null ? responseData.product.Image : product.Image
          };
        }
        return product;
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleImageUpload = (files) => {
    const file = files[0]; // Assuming only one file is selected
    setImage(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      // Read the image file and set it as the product image preview
      setImagePreview(reader.result);
    };

    if (file) {
      // Read the image file as a data URL
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    check&&
    <>
      {/* Button to open the modal */}
      <div className="fixed bottom-10 right-10 z-40">
        <button
          className="w-16 h-16 rounded-full flex justify-center items-center text-white text-3xl bg-gradient-to-br from-teal-400 to-sky-500 hover:from-teal-500 hover:to-sky-600"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>
      {/* UpdateModal */}
      {showUpdateModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              className={`w-full border rounded-md mb-2 p-2 ${
                highlightFields && !updatedName ? "border-red-500" : ""
              }`}
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Product Price"
              className={`w-full border rounded-md mb-2 p-2 ${
                highlightFields &&
                (!updatedPrice ||
                  isNaN(parseFloat(Price)) ||
                  parseFloat(Price) <= 0)
                  ? "border-red-500"
                  : ""
              }`}
              value={updatedPrice}
              onChange={(e) => setUpdatedPrice(e.target.value)}
            />
            <textarea
              placeholder="Product Description"
              className={`w-full border rounded-md mb-4 p-2 ${
                highlightFields && !updatedDescription ? "border-red-500" : ""
              }`}
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
            />

            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleUpdateProduct}
              >
                OK
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}
      {/* Delete */}
      {showDeleteModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{`This will delete ${deleteid}`}</h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => deleteProduct(deleteid)} // Pass a function reference
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setshowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              className={`w-full border rounded-md mb-2 p-2 ${
                highlightFields && !Name ? "border-red-500" : ""
              }`}
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Product Price"
              className={`w-full border rounded-md mb-2 p-2 ${
                highlightFields &&
                (!Price || isNaN(parseFloat(Price)) || parseFloat(Price) <= 0)
                  ? "border-red-500"
                  : ""
              }`}
              value={Price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
              placeholder="Product Description"
              className={`w-full border rounded-md mb-4 p-2 ${
                highlightFields && !Description ? "border-red-500" : ""
              }`}
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            {/* Buttons */}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleAddProduct}
              >
                OK
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}

      <div className="mb-4 w-full">
        <div className="mx-4">
          <h5 className="text-4xl mt-4">Manage Products</h5>
          <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700"></hr>
        </div>
        <div className="mx-4 flex flex-wrap">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white mb-5 mx-auto rounded-lg overflow-hidden shadow-lg shadow-gray-600 hover:shadow-xl hover:shadow-gray-600 hover:cursor-pointer transition-shadow w-full xs:w-[48%] md:w-1/3 lg:w-[30%] sm:1/2"
            >
              <div className="relative">
                <img
                  className="w-full object-cover h-56"
                  src={product.Image}
                  alt="Product Image"
                />
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
                  #{product.ID}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">{product.Name}</h3>
                <h3 className="text-lg font-medium mb-2">
                  {product.Description}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{product.Price} pkr</span>
                  <div className="flex">
                    <button
                      className="mx-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        handledeleteProduct(product.ID, product.Name);
                        console.log(product);
                        setdeleteid(product.ID);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() =>
                        openEditModal(
                          product.ID,
                          product.Name,
                          product.Price,
                          product.Description
                        )
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageProducts;
