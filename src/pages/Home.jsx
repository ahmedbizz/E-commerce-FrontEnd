import React, { useEffect, useState, useRef } from "react";
import { GetProducts } from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";
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
import { ArrowForward, ArrowBack } from "@mui/icons-material"; // إضافة أيقونات الأسهم
export default function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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



  return (
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
                  className="GO_TO_SHOP_BT"
                  onClick={() => {
                    const scrollHeight = document.documentElement.scrollHeight; // طول الصفحة
                    const viewportHeight = window.innerHeight; // طول الشاشة
                    const targetPosition = scrollHeight - viewportHeight * 0.75; // قبل النهاية بـ 3/4 الشاشة

                    window.scrollTo({
                      top: targetPosition,
                      behavior: "smooth", // نزول سلس
                    });
                  }}
                >
                  Go To Shoping
                </Button>
              </Box>
            ))}
          </Slider>
        </>
      )}
    </Box>
  );
}
