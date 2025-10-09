import React, { useEffect, useContext, useState, useMemo } from "react";
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
  TextField,
  InputAdornment,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@mui/material";

import {
  Search as SearchIcon,
  ShoppingBagOutlined,
  LocalShippingOutlined,
  Close,
  Check,
} from "@mui/icons-material";

import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { GetTargetGroups } from "../../services/TargetGroupService";
import { GetBrandByType } from "../../services/BransService";
import { GetProducts } from "../../services/productService";
import { useNavigate, Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Cookies from "js-cookie";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [anchorSearch, setAnchorSearch] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const [targetGroups, setTargetGroups] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [anchorElMNI, setAnchorElMNI] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🟢 تحميل المنتجات
  useEffect(() => {
    (async () => {
      try {
        const res = await GetProducts();
        setAllProducts(res.data.items);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // 🟢 تحميل المجموعات
  useEffect(() => {
    (async () => {
      try {
        const res = await GetTargetGroups();
        setTargetGroups(res.data);
      } catch {
        setTargetGroups([]);
      }
    })();
  }, []);

  // 🔍 البحث عن المنتجات
  const visibleProducts = useMemo(() => {
    if (!query) return [];
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);

  const handleSearchChange = (e) => setQuery(e.target.value);
  const handleCloseSearch = () => setAnchorSearch(null);

  // 🟢 التبديل بين اللغات
  const handleLanguageChange = (event, index) => {
    setSelectedIndex(index);
    Cookies.set("language", index, { expires: 7, secure: true });
    setAnchorElLang(null);
    i18n.changeLanguage(index === 0 ? "ar" : "en");
  };

  // 🟢 القائمة المنسدلة
  const handleOpenMenu = (event, group) => {
    setAnchorElMNI(event.currentTarget);
    setHoveredGroup(group);

    (async () => {
      try {
        const res = await GetBrandByType(group.id);
        setBrands(res.data.brands);
      } catch {
        setBrands([]);
      }
    })();
  };

  const handleCloseMenu = () => {
    setAnchorElMNI(null);
    setHoveredGroup(null);
  };

  // 🟢 التنقل إلى الصفحة المناسبة
  const handleBrandClick = (group, brand) => {
    const params = new URLSearchParams({ brandId: brand.id, groupId: group.id });
    navigate(`products/all?${params.toString()}`);
  };

  const handleCategoryClick = (cate, group, brand) => {
    const params = new URLSearchParams({
      brandId: brand.id,
      groupId: group.id,
      categoryId: cate.id,
    });
    navigate(`products/all?${params.toString()}`);
  };

  // 🟢 تسجيل الخروج
  const handleLogout = () => {
    logoutUser();
    setAnchorEl(null);
  };

  // 🟢 تأثير عند التمرير
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box>
      <Box sx={{ height: "65px" }} />

      <AppBar
        className="AppBarHeader"
        position={isScrolled ? "fixed" : "static"}
      >
        <Toolbar className="Toolbar">
          {/* 🔸 الشعار والبحث */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: "white" }}
            >
              {t("Home")}
            </Typography>
            <IconButton onClick={() => setAnchorSearch(true)} color="inherit">
              <SearchIcon />
            </IconButton>
          </Box>

          {/* 🔸 المجموعات */}
          <Box className="TargetGroupRes">
  {targetGroups.map((group, i) => (
    <Box
      key={i}
      sx={{ position: "relative", display: "inline-block", mx: 3 }}
      onMouseEnter={(e) => handleOpenMenu(e, group)}
      onMouseLeave={handleCloseMenu}
    >
      <Button color="inherit" className="button">
        {t(group.name)}
      </Button>

      {/* القائمة المنسدلة (بدون Popper) */}

    </Box>
  ))}
</Box>


          {/* 🔸 المستخدم */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <IconButton component={Link} to="/orders" color="inherit">
                  <Badge badgeContent={0} color="error">
                    <LocalShippingOutlined />
                  </Badge>
                </IconButton>

                <IconButton component={Link} to="/cart" color="inherit">
                  <Badge badgeContent={cartItems.length} color="error">
                    <ShoppingBagOutlined />
                  </Badge>
                </IconButton>

                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar
                    alt={user.name}
                    src={
                      user.image
                        ? `${import.meta.env.VITE_BASE_URL}/images/Users/${user.image}`
                        : "/user-avatar.jpg"
                    }
                  />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem component={Link} to="/profile">
                    {t("Profile")}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
                </Menu>
              </>
            ) : (
              <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                {t("Login")}
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {hoveredGroup && (
        <Box className="DropDownBox">
          {brands.map((brand, j) => (
            <Box key={j} className="brand-item">
              <Box
                className="brand-title"
                onClick={() => handleBrandClick(hoveredGroup, brand)}
              >
                {brand.name}
              </Box>

              {brand.categories?.map((cate, k) => (
                <Box
                  key={k}
                  className="category-item"
                  onClick={() => handleCategoryClick(cate, hoveredGroup, brand)}
                >
                  {cate.name}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
      {/* 🔍 البحث */}
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
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box className="Search-Box">
              <Typography className="Typography">
                <Check />
              </Typography>
              <TextField
                variant="outlined"
                placeholder={t("Search")}
                onChange={handleSearchChange}
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
              <IconButton onClick={handleCloseSearch}>
                <Close />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 2,
                width: "100%",
                maxHeight: 600,
                overflowY: "auto",
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
  );
}
