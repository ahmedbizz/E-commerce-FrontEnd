import React, { useEffect, useState, useRef } from "react";
import { GetProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material"; // إضافة أيقونات الأسهم
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3, // للشاشات الكبيرة
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024, // تابلت
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 820, // جوال (يغطي Safari + Chrome + غيره)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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



  return (
    <Box className="ads-container-home">
      {loading ? (
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
              <Box className="slide" key={index}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                navigate('/products/all');
              
              }}
              >
                <img  src={`${import.meta.env.VITE_BASE_URL}/images/Products/${item.imageUrl}`} alt={`Ad ${index + 1}`} />

              </Box>
            ))}
          </Slider>
        </>
      )}
    </Box>
  );
}
