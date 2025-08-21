import React, { useEffect, useState, useRef } from "react";
import { GetProducts } from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";
import {GetProductsByBrand} from "../services/BransService"
import { Box, Grid, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

const Products = ({productsAPI}) => {
  const {brandId} = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(brandId){
      GetProductsByBrand(brandId)
      .then((res) => {
        console.log(res)
        setProducts(res.data.products);
      })
      .finally(() => setLoading(false));
    }else{
      GetProducts()
      .then((res) => {
        setProducts(res.data.items);
      })
      .finally(() => setLoading(false));
    }

  }, []);

  return (
    <Box >
      {loading ? (
        <Grid container justifyContent="center" mt={4}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Box className="Box-Products">
            {(productsAPI ? productsAPI:products || []).map((item, index) => (
              <Box>
                <ProductCard product={item} key={index} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Products;
