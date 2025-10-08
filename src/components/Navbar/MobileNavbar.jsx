import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Typography,
  ClickAwayListener,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import DensityMediumOutlined from "@mui/icons-material/DensityMediumOutlined";
import { GetTargetGroups } from "../../services/TargetGroupService";
import { GetBrandByType } from "../../services/BransService";
import { GetProducts } from "../../services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";

export default function MobileNavbar() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [TargetGroupRes, setTargetGroup] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [anchorSearch, setAnchorSearch] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tg = await GetTargetGroups();
        setTargetGroup(tg.data);

        const products = await GetProducts();
        setAllProducts(products.data.items);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const visibleProducts = useMemo(() => {
    if (!query) return [];
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);

  const handleLogout = () => {
    logoutUser();
    setAnchorMenu(null);
  };

  const handleLanguageChange = (index) => {
    setSelectedIndex(index);
    Cookies.set("language", index, { expires: 7, secure: true });
    if (index === 0) i18n.changeLanguage("ar");
    else i18n.changeLanguage("en");
  };

  const handleOpenBrands = async (group) => {
    try {
      const res = await GetBrandByType(group.id);
      setBrands(res.data.brands);
      setHoveredGroup(group);
    } catch {
      setBrands([]);
      setHoveredGroup(group);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box className="MobileHeader">
        <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
          <DensityMediumOutlined />
        </IconButton>

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: "white", textDecoration: "none" }}
        >
          Logo
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={cartItems.length} color="error">
              <ShoppingBagOutlined />
            </Badge>
          </IconButton>
          <IconButton component={Link} to="/orders" color="inherit">
            <LocalShippingOutlined />
          </IconButton>
          <IconButton color="inherit">
            <FavoriteBorder />
          </IconButton>
          {user && (
            <IconButton onClick={(e) => setAnchorMenu(e.currentTarget)}>
              <Avatar
                alt={user.name}
                src={
                  user.image
                    ? `${import.meta.env.VITE_BASE_URL}/images/Users/${
                        user.image
                      }`
                    : "/user-avatar.jpg"
                }
              />
            </IconButton>
          )}
          <Menu
            anchorEl={anchorMenu}
            open={Boolean(anchorMenu)}
            onClose={() => setAnchorMenu(null)}
          >
            <MenuItem
              component={Link}
              to="/profile"
              onClick={() => setAnchorMenu(null)}
            >
              {t("Profile")}
            </MenuItem>
            <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Drawer for mobile menu */}
      {/* Drawer for mobile menu */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        className="DrawerMobile"
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ display: "flex", flexDirection: "column", p: 2 }}>
          {/* Language selection */}
          <Box sx={{ mb: 2 }}>
            {["AR", "ENG"].map((lang, idx) => (
              <Button
                key={lang}
                variant={selectedIndex === idx ? "contained" : "outlined"}
                onClick={() => handleLanguageChange(idx)}
                sx={{ mb: 1, width: "100%" }}
              >
                {lang}
              </Button>
            ))}
          </Box>

          {/* Target Groups */}
          {TargetGroupRes.map((group, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <ListItemButton
                onClick={async () => {
                  await handleOpenBrands(group);
                  // في حال عدم وجود براندات ننتقل مباشرة
                  if (!Brands.length) {
                    navigate(`/products/all?groupId=${group.id}`);
                    setDrawerOpen(false);
                  }
                }}
              >
                <ListItemText primary={group.name} />
              </ListItemButton>

              {/* Brands */}
              {hoveredGroup === group && (
                <List sx={{ pl: 2 }}>
                  {Brands.map((brand, bIdx) => (
                    <ListItemButton
                      key={bIdx}
                      onClick={() => {
                        navigate(
                          `/products/all?brandId=${brand.id}&groupId=${group.id}`
                        );
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemText primary={brand.name} />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Box>
          ))}
        </List>
      </Drawer>

      {/* Search Popper */}
      {anchorSearch && (
        <ClickAwayListener onClickAway={() => setAnchorSearch(false)}>
          <Paper
            sx={{
              p: 2,
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              zIndex: 1300,
            }}
          >
            <TextField
              fullWidth
              placeholder={t("Search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
}
