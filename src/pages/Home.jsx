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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024, // أقل من 1024px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // أقل من 768px
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
              <Box className="slide" key={index}
              onClick={() => {
                navigate('/products/all');
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
