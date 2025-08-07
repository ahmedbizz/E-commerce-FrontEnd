import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useEffect, useState } from "react";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Box,
} from "@mui/material";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then((res) => {
        setProduct(res.data);
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardMedia
          component="img"
          height="350"
          image={`https://localhost:7137/images/Products/${product.imageUrl}`}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, whiteSpace: "pre-line" }}
          >
            {product.description || "لا يوجد وصف متاح لهذا المنتج."}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            السعر: {product.price} ريال
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
