import { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import Panel from "../components/Panel/Panel";
import SignInCard from "../components/SignInComponents/SignInCard";
import Content from "../components/SignInComponents/Content";
import Slider from "react-slick";

import { GetProducts } from "../services/productService";
import { GetBrands } from "../services/BransService";

export default function SignInSide(props) {
  const [images, setimages] = useState([]);

  const fetchProducts = async (page = 1) => {
    try {
      const res = await GetBrands();
      setimages(res.data.items);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
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
    <Box className="SignBoxContiner">
      <Slider {...settings}>
        {(images || []).map((img, index) => (
          <Box className="slide" key={index}>
            <img
              src={`${import.meta.env.VITE_BASE_URL}/images/Brands/${img.imageUrl}`}
              alt={`Ad ${index + 1}`}
              style={{ width: "100%", height: "100%" }}
            />
            <div className="overlay"></div>
          </Box>
        ))}
      </Slider>
      <SignInCard />
    </Box>
  );
}
