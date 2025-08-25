import React, { useEffect, useState, useRef } from "react";
import { GetProducts } from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";
import { GetProductsByBrand } from "../services/BransService";
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
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";

const Products = ({ productsAPI }) => {
  const { t } = useTranslation();
  const { brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPrice, setOpenPrice] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [Filter, setFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

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
  useEffect(() => {
    if (brandId) {
      GetProductsByBrand(brandId)
        .then((res) => {
          setProducts(res.data.products);
          setFilter(res.data.products);
        })
        .finally(() => setLoading(false));
    } else {
      GetProducts()
        .then((res) => {
          setProducts(res.data.items);
          setFilter(res.data.items);
        })
        .finally(() => setLoading(false));
    }
  }, []);

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

  const HandelFilters = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(products); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }
    const filtered = products.filter(
      (pro) =>
        pro.name.toLowerCase().includes(query.toLowerCase()) ||
        pro.brandId.toString().includes(query) ||
        pro.targetGroupId.toString().includes(query) ||
        pro.categoryId.toString().includes(query)
    );
    setFilter(filtered);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          sx={{ animation: "rotate 1.5s linear infinite" }}
          size={80}
        />
      </Box>
    );
  }

  return (
    <Box className="Products-container">
      <Box className="Head-Side">
        <Button className="Button" onClick={toggleDrawer(true)}>
          {t("Filters")}
          <MenuIcon />
        </Button>
        <Button className="Button" onClick={handleClick}>
          {t("Sort By: Featured")}
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
                <ListItemText primary="فلترة بالماركة" />
                {openBrand ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openBrand} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Nike" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Adidas" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Puma" />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* فلترة بالفئة */}
              <ListItemButton onClick={() => setOpenCategory(!openCategory)}>
                <ListItemText primary="فلترة بالفئة" />
                {openCategory ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openCategory} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="رجالي" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="نسائي" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="ولادي" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Paper>
        </Slide>

        <Box className="Box-Products">
          {(productsAPI ? productsAPI : Filter || []).map((item, index) => (
            <Box>
              <ProductCard product={item} key={index} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Products;
