import * as React from "react";
import { useParams } from "react-router-dom";
import { GetProductById } from "../services/productService";
import { useEffect, useState, useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { formatPrice } from "/src/utils/formatPrice";
import { GetProducts } from "../services/productService";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { AddToCart } from "../services/CartService";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useMediaQuery } from "@mui/material";
const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ProductDetails() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { cartItems, fetchCart} = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setcurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [open, setOpen] = useState(false);
  const [openNotifcation, setOpenNotifcation] = useState(false);
  const [openErorrNotifcation, setOpenErorrNotifcation] = useState(false);
  const [Error, setError] = useState(null);
  const [success, setsuccess] = useState("");
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3, // عدد الصور على الشاشات الكبيرة
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderRef = useRef(null);
  useEffect(() => {
    GetProducts()
      .then((res) => setProducts(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    GetProductById(id)
      .then((res) => {
        setProduct(res.data);
        setcurrentImage(res.data.imageUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handelCart = async () => {
    if (!user) {
      setError(t("unauth"));
      setOpen(true);
      return;
    }
    try {
      if (!selectedSize || !selectedSize.name) {
        setError(t("size-error"));
        setOpenErorrNotifcation(true);
        return;
      }
      const data = {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
        SizeId: selectedSize.id,
        StockQuantity: product.stockQuantity
      };
      
      const res = await AddToCart(data);

      fetchCart();
      setsuccess(res.data.message);
      setSelectedSize({});
      setOpenNotifcation(true);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const messages = error.response.data.message;
        setError(Array.isArray(messages) ? messages.join("\n") : messages);
      } else {
        setError(t("erorr"));
      }
      setOpenErorrNotifcation(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading)
    return (
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
    );

  if (!product)
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        لم يتم العثور على المنتج.
      </Typography>
    );

  return (
    <Box className="ProductDetailsContainer">
      <Snackbar
        open={openNotifcation}
        autoHideDuration={1000}
        onClose={() => setOpenNotifcation(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <CustomAlert severity="success">{success}</CustomAlert>
      </Snackbar>

      <Snackbar
        open={openErorrNotifcation}
        autoHideDuration={1000}
        onClose={() => setOpenErorrNotifcation(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <CustomAlert severity="error">{Error}</CustomAlert>
      </Snackbar>

      <Dialog
        className="Card-Continer-Dialog"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: "rgba(30, 30, 30, 0.7)",
            backdrop: "blur(12px) saturate(150%)" ,
            WebkitBackdropFilter: "blur(12px) saturate(150%)" ,
            borderRadius: "14px" ,
            border: "1px solid rgba(255, 255, 255, 0.2)" ,
            overflow: "hidden" ,
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)" ,
            animation: "fadeInScale 0.25s ease" ,
          },
        }}
      >
        <Box className="Card">
          <DialogTitle className="DialogTitle">{"Alert"}</DialogTitle>
          <DialogContent className="DialogContent">
            <Typography variant="h5">{Error}</Typography>
            <Button className="login-button" onClick={() => navigate("/login")}>
              {t("Login")}
            </Button>
          </DialogContent>
        </Box>
      </Dialog>
      <Box className="ImageSide">
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <img
          style={{
            position:"relative"
            ,cursor:"pointer"
          }}
          component="img"
          src={`${import.meta.env.VITE_BASE_URL}/images/Products/${currentImage}`}
          alt={product.name}
        />
            {product.stockQuantity == 0?
          <Box
    sx={{
      position: "absolute",
      top: "20%",
      left: "-5%",
      backgroundColor: "red",
      color: "white",
      fontWeight: "bold",
      transform: "rotate(-22deg)",
      padding: "4px 40px",
      textAlign: "center",
      fontSize: "28px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      width:"100%",
      height:"30px"
    }}
  >
    Sold Out
          </Box>:<></>}
  </Box>
        <Box className="ImageList">
          {product.productImages.slice(0, 5).map((img, index) => {
            return (
              <Box
                key={index}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => {
                  setcurrentImage(img.imageUrl);
                }}
              >
                <img
                  component="img"
                  key={index}
                  src={`${import.meta.env.VITE_BASE_URL}/images/Products/${img.imageUrl}`}
                  alt="Icon 2"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "15px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    cursor:"pointer"
                  }}
                />
              
              </Box>
            );
          })}
        </Box>

      </Box>
  
      <Box className="DetailsSide">
        <Box className="Title">
          <Typography className="ProductName">{product.name}</Typography>

          <Typography className="ProductPrice">
            {formatPrice(product.price)}
          </Typography>
        </Box>
        <Box className="ColorOptions">
          {product.productImages.map((img, index) => {
            return (
              <Box
                key={index}
                className={`ColorCircle ${
                  selectedColor === img.imageUrl ? "selected" : ""
                }`}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => {
                  setcurrentImage(img.imageUrl);
                  setSelectedColor(img.imageUrl);
                }}
              >
                <img
                  component="img"
                  key={index}
                  src={`${import.meta.env.VITE_BASE_URL}/images/Products/${img.imageUrl}`}
                  alt="Icon 2"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "5px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Select Size</Typography>
          <Typography variant="h6">Sizes</Typography>
        </Box>
        <Box className="SizeBox">
          <Box className="SizeOptions">
            {(product.productSizes || []).map((size, index) => {
              return (
                <Button
                  key={index}
                  className={`SizeButton ${
                    selectedSize.id === size.id ? "selected" : ""
                  }`}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => {
                    setSelectedSize(size);
                  }}
                >
                  {size.name}
                </Button>
              );
            })}
          </Box>
        </Box>
        <Box className="ActionButtons">
          {product.stockQuantity == 0? <Box sx={{
            display:"flex",
            justifyContent:"center",
            fontSize:"32px",
            fontWeight:"bold",
            color:"red"
          }}>
             <Typography variant="h6">Soled Out !!</Typography>
          </Box >:  
          <Button className="AddToCart" onClick={() => handelCart(product)}>
            Add to bag
          </Button>}
  
          <Button className="Faveorite">Faveorite</Button>
        </Box>
        <Box className="ExtraInfos">
          <Typography>
            {product.description || "لا يوجد وصف متاح لهذا المنتج."}
          </Typography>
        </Box>
      </Box>
      <Box className="ads-container-home">
        {loading ? (
          <Grid container justifyContent="center" mt={4}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Box className="Button_titel_Panel">
              <Typography className="title">{t("shop_Item")}</Typography>
              <Box>
                <IconButton
                  className="Icon-button"
                  variant="contained"
                  onClick={() => sliderRef.current.slickPrev()}
                >
                  <ArrowBack />
                </IconButton>
                <IconButton
                  className="Icon-button"
                  variant="contained"
                  onClick={() => sliderRef.current.slickNext()}
                >
                  <ArrowForward />
                </IconButton>
              </Box>
            </Box>
            <Slider className="Slider" ref={sliderRef} {...settings}>
              {products.map((item, index) => (
                <Box
                  className="slide"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  }}
                  key={index}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/Products/${item.imageUrl}`}
                    alt={`Ad ${index + 1}`}
                  />
                </Box>
              ))}
            </Slider>
          </>
        )}
      </Box>
    </Box>
  );
}
