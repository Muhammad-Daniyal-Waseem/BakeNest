import "./App.css";
import Popular from "./components/Popular";
import Search from "./components/Search";
import Login from "./components/Login";
import Signup from "./components/Signup"
import ProductDetail from "./components/ProductDetail";
import Orders from "./components/Orders";
import Cart from "./components/Cart";
import Admin from "./AdminComponents/Admin";
import { ProductProvider } from "./context/ProductContext";
import { UserProvider } from "./context/UserContext";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ProductProvider>
      <UserProvider>
        <BrowserRouter>
          <>
          <Routes>
              <Route path="/" element={<Popular />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/productDetail" element={<ProductDetail />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </>
        </BrowserRouter>
      </UserProvider>
    </ProductProvider>
  );
}

export default App;
