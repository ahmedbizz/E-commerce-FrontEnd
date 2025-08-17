import React, { useEffect, useState } from "react";
import { GetProducts } from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";
import Panel from "../components/Panel/Panel";
import { Box, Grid, IconButton, CircularProgress } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material"; // إضافة أيقونات الأسهم
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetProducts()

      .then(res => setProducts(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  const images = [
    "../../public/Images/pexels-avneet-kaur-669191817-19294576.jpg",
    "../../public/Images/pexels-craytive-1503009.jpg",
    "../../public/Images/pexels-marcus-queiroga-silva-86421404-12363437.jpg",
    "../../public/Images/pexels-wesleydavi-15336560.jpg",
    "../../public/Images/pexels-wesleydavi-15336560.jpg",
    "../../public/Images/pexels-wesleydavi-15336560.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setitemsPerPage] = useState(4);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setitemsPerPage(itemsPerPage - 1);
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleNext = () => {
    if (itemsPerPage < images.length) {
      setitemsPerPage(itemsPerPage + 1);
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <Box className="Products-Main-container">
      <Panel/>
      <Box
        sx={{
          display: "flex",
          justifyContent:"center",
          alignItems:"center",
          gap:"10px",
        }}
      >
        <IconButton sx={{ width:"50px",height:"50px"}} onClick={() => handlePrevious()}>
          <ArrowBack />
        </IconButton>

        <Box
          key={currentIndex} // لتحديث الحركة عند تغيير الفئات


        >
          <Box
            sx={{ display: "flex" , gap:"10px" , margin:"20px"}}
          >
            {images.slice(currentIndex, itemsPerPage).map(
              (item, index) => (
                <Box
        
                component="img"
                src={item}
                alt={`Image ${index + 1}`}
                sx={{
                  width: "300px",
                  height: "400px",
                  objectFit: "cover",
                }}
              />
              )
            )}
          </Box>
        </Box>
        <IconButton  sx={{ width:"50px",height:"50px"}} onClick={() => handleNext()}>
          <ArrowForward />
        </IconButton>
      </Box>

      {loading ? (
        <Grid container justifyContent="center" mt={4}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {(products || []).map((product,index) => (
            <Grid  key={index}  >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
