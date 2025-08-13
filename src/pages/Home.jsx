import React, { useEffect, useState } from "react";
import { GetProducts } from "../services/productService";
import ProductCard from "../components/ProductCard/ProductCard";
import { Container, Grid, Typography, CircularProgress } from "@mui/material";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetProducts()

      .then(res => setProducts(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        المنتجات
      </Typography>

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
    </Container>
  );
}
