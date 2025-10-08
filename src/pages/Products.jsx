import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import {
  Box,
  Paper,
  List,
  ListItemText,
  Slider,
  CircularProgress,
  Slide,
  ListItemButton,
  Collapse,
  Menu,
  MenuItem,
  Button,
  Pagination,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { GetTargetGroups } from "../services/TargetGroupService";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {GetBrands} from "../services/BransService";
import { useTranslation } from "react-i18next";
import { GetProducts } from "../services/productService";
const Products = ({ productsAPI }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPrice, setOpenPrice] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [Filter, setFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [brandsRes, setbrands] = useState([]);
  const [TargetGroupRes, setTargetGroup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    searchTerm: "",
    brandId: null,
    groupId: null,
    categoryId: null,
    minPrice: null,
    maxPrice: null,
  });
  const [hasMore, setHasMore] = useState(true);
  const observer = React.useRef();

  const lastProductRef = React.useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
  
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      });
  
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );


  useEffect(() => {
    const initialFilters = {
      searchTerm: searchParams.get("searchTerm") || "",
      brandId: searchParams.get("brandId") ? Number(searchParams.get("brandId")) : null,
      groupId: searchParams.get("groupId") ? Number(searchParams.get("groupId")) : null,
      categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null,
    };
    setFilters(initialFilters);
    fetchProducts(currentPage, initialFilters);
  }, [searchParams, currentPage]);
  
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
  // To fetch all brands
  useEffect(() => {
    async function fetchData() {
      try {
        const brandsRes = await GetBrands();
        setbrands(brandsRes.data.items);
      } catch (err) {
        setbrands([]);
      }
    }
    fetchData();
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = (state) => () => {
    setOpen(!open);
  };

  // fetch products from API
const fetchProducts = async (page = 1, filtersArg = filters) => {
  setLoading(true);
  try {
    const params = { page };
    Object.entries(filtersArg).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        params[key] = value;
      }
    });

    const res = await GetProducts(params);
    const newProducts = res.data.items;

    if (page === 1) {
      setProducts(newProducts);
      setFilter(newProducts);
    } else {
      setProducts((prev) => [...prev, ...newProducts]);
      setFilter((prev) => [...prev, ...newProducts]);
    }

    setHasMore(page < res.data.totalPages);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};


  const handleFilterChange = (newFilters) => {
  
    const clearedFilters = {
      searchTerm: "",
      brandId: null,
      groupId: null,
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      ...newFilters, 
    };
  
    setFilters(clearedFilters);
  
  
    const searchParams = new URLSearchParams();
    Object.entries(clearedFilters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    navigate(`?${searchParams.toString()}`, { replace: true });
  };
  

  // Sort by price lower and higher
  const sortByPrice = (order) => {
    const sorted = [...products].sort((a, b) => {
      if (order === "asc") return a.price - b.price;
      if (order === "desc") return b.price - a.price;
      return 0;
    });
    setFilter(sorted);
  };

  //  Filter By price range
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);

    const [min, max] = newValue;
    const filtered = products.filter((p) => p.price >= min && p.price <= max);
    setFilter(filtered);
  };



  


  return (
<>
{loading && (
    <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(30, 30, 30, 0.7)", // غطاء شفاف
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000, // فوق كل العناصر
      backdropFilter: "blur(3px)", // يعطي تأثير ضبابي جميل
    }}
  >
    <CircularProgress size={70} thickness={4} color="primary" />
  </Box>
  )}
      <Box className="Products-container">
        <Box className="Head-Side">
          <Button className="Button" onClick={toggleDrawer(true)}>
            {t("Filters")}
            <MenuIcon />
          </Button>
          <Button className="Button" onClick={handleClick}>
            {t("Sort By ")}
            <ExpandMoreIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={() => sortByPrice("asc")}>
              {t("Low-price")}
            </MenuItem>
            <MenuItem onClick={() => sortByPrice("desc")}>
              {t("High-price")}
            </MenuItem>
          </Menu>
        </Box>
  
        <Box className="Main-Side">
          <Slide
            className="Filter-Side"
            direction="right"
            in={open}
            mountOnEnter
            unmountOnExit
          >
            <Paper className="DrawerStyle">
              <List>
                {/* فلترة بالسعر */}
                <ListItemButton onClick={() => setOpenPrice(!openPrice)}>
                  <ListItemText primary={t("Filters")} />
                  {openPrice ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openPrice} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 4, pr: 4, pt: 2 }}>
                    <Slider
                      className="PriceSlider"
                      value={priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                      step={10}
                    />
                  </Box>
                </Collapse>
  
                {/* فلترة بالماركة */}
                <ListItemButton onClick={() => setOpenBrand(!openBrand)}>
                  <ListItemText primary={t("BrandFilter")} />
                  {openBrand ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openBrand} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {brandsRes.map((item, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleFilterChange({ brandId: item.id })}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
  
                <ListItemButton onClick={() => setOpenGroup(!openGroup)}>
                  <ListItemText primary={t("GroupFilter")} />
                  {openGroup ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openGroup} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {TargetGroupRes.map((item, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleFilterChange({ groupId: item.id })}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </List>
            </Paper>
          </Slide>
  
          <Box className="Main-Box-Products">
    <Box className="Box-Products">
      {Filter.map((item, index) => {
        if (index === Filter.length - 1) {
          return (
            <Box ref={lastProductRef} key={index}>
              <ProductCard product={item} />
            </Box>
          );
        }
        return (
          <Box key={index}>
            <ProductCard product={item} />
          </Box>
        );
      })}
    </Box>
  
  
  </Box>
  
  
  
        </Box>
      </Box>
</>
  );
};

export default Products;
