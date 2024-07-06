import * as React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import Navbar from "./Navbar";
import axios from "axios";

import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { UserContext } from "../context/UserContext";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { useState } from "react";

const white = "#C5AA6A";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // transition: theme.transitions.create("width"),
  },
}));

export default function Header() {
  const { getProductsBySearch, searchQuery, setSearchQuery, setSearchResult } =
    useContext(ProductContext);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const search = async () => {
    try {
      const response = await getProductsBySearch();
      setSearchResult(response.product);
      navigate("/search");
    } catch (error) {
      console.error(error);
    }
  };

  const { host, cartCount, setCartCount } = useContext(UserContext);

  const fetchData = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      return;
    }

    try {
      const responseAuth = await axios.post(
        `${host}/auth`,
        { token: token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(responseAuth.data);
      // Fetch user data
      const response = await axios.post(
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
      const userData = response.data;

      const requestBody = {
        customerId: userData.ID,
      };

      const getCartResponse = await axios.post(
        `${host}/getCartItem`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCartCount(getCartResponse.data.cartResult.length);
      console.log(getCartResponse.data.cartResult.length);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="workSans">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: white }}>
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                BakeNest
              </Typography>
              <Box sx={{ flexGrow: 5 }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="I'm shopping for..."
                    inputProps={{ "aria-label": "search" }}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        search();
                      }
                    }}
                  />
                </Search>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "flex", md: "flex" } }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  // aria-controls={menuId}
                  aria-haspopup="true"
                  // onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon
                      fontSize="large"
                      onClick={() => {
                        if (localStorage.getItem("auth-token")) {
                          navigate("/cart");
                        } else {
                          navigate("/login");
                        }
                      }}
                    />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  // aria-controls={menuId}
                  aria-haspopup="true"
                  // onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle
                    fontSize="large"
                    onClick={() => {
                      if (localStorage.getItem("auth-token")) {
                        navigate("/login");
                      } else {
                        navigate("/signup");
                      }
                    }}
                  />
                                  </IconButton>
<IconButton>
                  <ExitToAppIcon
                       fontSize="large"
                         onClick={() => {
                          localStorage.removeItem("auth-token")
                            navigate("/login");
                        }}
                  ></ExitToAppIcon>
                  </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      <Navbar />
    </>
  );
}
