import React, { useEffect, useContext, useState } from "react";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  List,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { GetTargetGroups } from "../../services/TargetGroupService";
import { GetBrandByType } from "../../services/BransService";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { GetProducts } from "../../services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";
import Close from "@mui/icons-material/Close";
import Check from "@mui/icons-material/Check";
import { useMemo } from 'react';
import Cookies from "js-cookie";


export default function Navbar() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logoutUser } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElang, setAnchorElang] = useState(null);
  const [anchorSearch, setAnchorSearch] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [TargetGroupRes, setTargetGroup] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [Filter, setFilter] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [query, setQuery] = useState("");

  const fetchProducts = async (value) => {
    try {
      const res = await GetProducts();
      console.log(res.data.items);
      setAllProducts(res.data.items); 
      setFilter([]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  //  for loadeing Tagrget Group List
  useEffect(() => {
    async function fetchData() {
      try {
        const TargetGroup = await GetTargetGroups();
      
        setTargetGroup(TargetGroup.data);
      } catch {
        setTargetGroup([]);
      }
    }
    fetchData();
  }, []);

  const handleBransClick = (group, brand) => {
    const params = new URLSearchParams();
    params.set("brandId", brand.id);
    params.set("groupId", group.id);
    navigate(`products/all?${params.toString()}`);
  };

  const handleCartegoryClick = (cate, group, brand) => {
    const params = new URLSearchParams();
    params.set("brandId", brand.id);
    params.set("groupId", group.id);
    params.set("categoryId", cate.id);
    navigate(`products/all?${params.toString()}`);
  };

  // to cahange langueg
  const options = ["AR", "ENG"];
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    Cookies.set("language", index, { expires: 7, secure: true });
    setAnchorEl(null);
    if (index === 0) {
      i18n.changeLanguage("ar");
    } else {
      i18n.changeLanguage("en");
    }
  };
  const open = Boolean(anchorElang);
  const handleClickListItem = (event) => {
    setAnchorElang(event.currentTarget);
  };
  const handleCloseElang = () => {
    setAnchorElang(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseSearch = () => {
    setAnchorSearch(null);
  };
  const handleLogout = () => {
    logoutUser();
    handleClose();
  };

  const [anchorElMNI, setAnchorElMNI] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);

  const handleOpenMNI = (event, group) => {
    const getBrans = async () => {
      try {
        var res = await GetBrandByType(group.id);
        setBrands(res.data.brands);
      } catch (err) {
        setBrands([]);
      }
    };
    setAnchorElMNI(event.currentTarget);
    setHoveredGroup(group);
    getBrans();
  };

  const handleCloseMNI = () => {
    setAnchorElMNI(null);
    setHoveredGroup(null);
  };


  const visibleProducts = useMemo(() => {
    if (!query) return []; // لا شيء قبل الكتابة
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box>
      {/* headar 1 section  */}
      <Box className="Box_header_1" sx={{ height: "65px" }}></Box>
      <AppBar
        className="AppBarHeader"
        position={isScrolled ? "fixed" : "static"}

      >
        <Toolbar
          sx={{
            display: anchorSearch ? "none" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* الشعار */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <List id="EN_AR_List" aria-label="Device settings">
              <ListItemButton
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  borderRadius: "10px",
                }}
                onClick={handleClickListItem}
              >
                <ListItemText secondary={options[selectedIndex]} />
              </ListItemButton>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorElang}
              open={open}
              onClose={handleCloseElang}
              MenuListProps={{
                "aria-labelledby": "lock-button",
                role: "listbox",
              }}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={option}
                  selected={index === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, index)}
                  sx={{ fontSize: "10px" }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: "white" }}
            >
              {t("Home")}
            </Typography>

            {/* البحث */}
            <TextField
              variant="outlined"
              placeholder={"Type.."}
              onClick={(e) => setAnchorSearch(true)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <Box>
              {(TargetGroupRes || []).map((group, index) => (
                <Box
                  key={index}
                  onMouseEnter={(e) => handleOpenMNI(e, group)}
                  sx={{ display: "inline-block", mx: 1 }}
                >
                  <Button
                    color="inherit"
                    sx={{
                      height: "60px",
                    }}
                  >
                    {t(group.name)}
                  </Button>

                  <Popper
                    open={Boolean(anchorElMNI) && hoveredGroup === group}
                    anchorEl={anchorElMNI}
                    placement="bottom-start"
                    style={{ width: "100%" }}
                  >
                    <ClickAwayListener onClickAway={handleCloseMNI}>
                      <Paper elevation={3}>
                        {(Brands || []).map((item, index) => (
                          <MenuList key={index}>
                            <MenuItem
                              onClick={() => handleBransClick(group, item)}
                            >
                              {item.name}
                            </MenuItem>
                            {(item.categories || []).map((cate, index) => (
                              <MenuList
                                sx={{
                                  paddingLeft: "30px",
                                  "& .MuiMenuItem-root": {
                                    display: "list-item",
                                    listStyleType: "circle",
                                    marginInline: "20px",
                                  },
                                }}
                                key={index}
                              >
                                <MenuItem
                                  onClick={() =>
                                    handleCartegoryClick(cate, group, item)
                                  }
                                >
                                  {cate.name}
                                </MenuItem>
                              </MenuList>
                            ))}
                          </MenuList>
                        ))}
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* صورة المستخدم وقائمة */}
            {user ? (
              <>
                {/* أيقونة السلة */}
                <IconButton
                  component={Link}
                  to="/orders"
                  size="large"
                  color="inherit"
                >
                  <Badge badgeContent={cartItems.length} color="error">
                {"Orders"}
                  </Badge>
                </IconButton>
                <IconButton
                  component={Link}
                  to="/cart"
                  size="large"
                  color="inherit"
                >
                  <Badge badgeContent={cartItems.length} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleMenu} size="large" sx={{ p: 0 }}>
                  <Avatar
                    alt={user.name}
                    src={
                      user.image
                        ? `https://localhost:7137/images/Users/${user.image}`
                        : "/user-avatar.jpg"
                    }
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                  >
                    {t("Profile")}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}> {t("Logout")}</MenuItem>
                </Menu>
              </>
            ) : (
              <Link
                to="/login"
                style={{ color: "white", textDecoration: "none" }}
              >
                {t("Login")}
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box>
        <Popper
          open={Boolean(anchorSearch)}
          anchorEl={anchorSearch}
          placement="bottom-start"
          sx={{ width: "100%", zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={handleCloseSearch}>
            <Paper
              elevation={4}
              sx={{
                p: 2,
                width: "100%",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* حقل البحث */}

              <Box className="Search-Box">
                <Typography className="Typography">
                  <Check />
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder={t("Search")}
                  onChange={(e) => handleSearch(e)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <IconButton
                  className="Icon-button"
                  variant="contained"
                  onClick={() => setAnchorSearch(false)}
                >
                  <Close />
                </IconButton>
              </Box>

              {/* هنا تقدر تعرض نتائج البحث */}
              <Box
  sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 16,
    width: '100%',
    maxHeight: 600,
    overflowY: 'auto',
  }}
>
  {visibleProducts.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</Box>

            </Paper>
          </ClickAwayListener>
        </Popper>
      </Box>
    </Box>
  );
}
