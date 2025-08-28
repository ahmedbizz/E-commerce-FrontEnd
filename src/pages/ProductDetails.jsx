import { useParams } from "react-router-dom";
import { GetProductById } from "../services/productService";
import { useEffect, useState ,useRef} from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import {formatPrice} from "/src/utils/formatPrice"
import { GetProducts } from "../services/productService";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setcurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3, // 👈 يخلي 3 منتجات/صور في نفس السلايد
    slidesToScroll: 1,
    vertical: false, // 👈 خلي العرض أفقي
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, 
    dots: true,
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
        setcurrentImage(res.data.imageUrl)
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);



  if (loading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
        aria-label="loading"
      >
        <CircularProgress />
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
      <Box className="ImageSide">
        
            <Box>
              {product.productImages.slice(0, 5).map((img, index) => {
                return (
                  <Box
                    key={index}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {setcurrentImage(img.imageUrl)}}
                  >
                    <img
                      component="img"
                      key={index}
                      src={`https://localhost:7137/images/Products/${img.imageUrl}`}
                      alt="Icon 2"
                      style={{

                        width: "60px",
                        height: "60px",
                        borderRadius: "15px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
        <img
          component="img"
          src={`https://localhost:7137/images/Products/${currentImage}`}
          alt={product.name}
        />

      </Box>
      <Box className="DetailsSide">
        <Box className="Title">
        <Typography  className="ProductName">
            {product.name}
          </Typography>

          <Typography className="ProductPrice">
          {formatPrice(product.price)} 
          </Typography>
        </Box>
        <Box className="ColorOptions">
        {product.productImages.map((img, index) => {
                return (
                  <Box
                    key={index}
                    className={`ColorCircle ${selectedColor === img.imageUrl ? "selected" : ""}`}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {setcurrentImage(img.imageUrl)
                      setSelectedColor(img.imageUrl)}}
                  >
                    <img
                      component="img"
                      key={index}
                      src={`https://localhost:7137/images/Products/${img.imageUrl}`}
                      alt="Icon 2"
                      style={{

                        width: "60px",
                        height: "60px",
                        borderRadius: "5px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        boxShadow:"0 8px 32px rgba(0,0,0,0.2)"
                      }}
                    />
                  </Box>
                );
              })}
        </Box>

        <Box sx={{display:"flex" ,justifyContent:"space-between"}}>
          <Typography variant="h6">Select Size</Typography>
          <Typography variant="h6">Sizes</Typography>
        </Box>
<Box classNam="SizeBox">

          <Box className="SizeOptions">
          <Button className="SizeButton">xs</Button>
          <Button className="SizeButton">s</Button>
          <Button className="SizeButton">M</Button>
            <Button className="SizeButton">L</Button>
            <Button className="SizeButton">XL</Button>
            <Button className="SizeButton">XXL</Button>
            </Box>
</Box>
        <Box className="ActionButtons">
        <Button className="AddToCart">Add to bag</Button>
            <Button className="Faveorite">Faveorite</Button>

        </Box>
        <Box className="ExtraInfos">
        <Typography
            
          >
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
            <Box >
              <IconButton className="Icon-button" variant="contained" onClick={() => sliderRef.current.slickPrev()}>
                <ArrowBack />
              </IconButton>
              <IconButton className="Icon-button" variant="contained" onClick={() => sliderRef.current.slickNext()}>
                <ArrowForward />
              </IconButton>
            </Box>
          </Box>
          <Slider ref={sliderRef} {...settings}>
            {products.map((item, index) => (
              <Box className="slide" key={index}>
                <img src={`https://localhost:7137/images/Products/${item.imageUrl}`} alt={`Ad ${index + 1}`} />
                <Button
                  variant="contained"
                  component={Link}
                  to={'/products/all'}
                  className="GO_TO_SHOP_BT"
                >
                  Go Shoping
                </Button>
              </Box>
            ))}
          </Slider>
        </>
      )}
    </Box>
    </Box>
  );
}
