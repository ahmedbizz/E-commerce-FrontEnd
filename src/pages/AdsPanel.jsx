import React from "react";
import Slider from "react-slick";
import { Box,Button,Grid  } from "@mui/material";

const images = [
  "../../public/Images/pexels-avneet-kaur-669191817-19294576.jpg",
  "../../public/Images/pexels-craytive-1503009.jpg",
  "../../public/Images/pexels-marcus-queiroga-silva-86421404-12363437.jpg",
  "../../public/Images/pexels-wesleydavi-15336560.jpg",
];

export default function AdsPanel() {
  const settings = {
  
    infinite: true,
    speed: 500,
    slidesToShow: 1, // عدد الصور الظاهرة في الشريحة
    slidesToScroll: 1,
    vertical: false, // إذا true تكون الشرايح طالعة ونازلة
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box className="ads-container">
      <Slider   {...settings}>
        {images.map((img, index) => (
          <Box className="slide" key={index}>
            <img
              src={img}
              alt={`Ad ${index + 1}`}
              style={{ width: "100%", height:"100%"}}
            />
             <div className="overlay"></div>
             <Button variant="contained" className="GO_TO_SHOP_BT" onClick={()=>{
                  const scrollHeight = document.documentElement.scrollHeight; // طول الصفحة
                  const viewportHeight = window.innerHeight; // طول الشاشة
                  const targetPosition = scrollHeight - viewportHeight * 0.75; // قبل النهاية بـ 3/4 الشاشة
              
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth", // نزول سلس
                  });
             }} >Go To Shoping</Button>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
