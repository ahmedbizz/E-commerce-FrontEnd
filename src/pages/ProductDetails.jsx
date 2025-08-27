import { useParams } from "react-router-dom";
import { GetProductById } from "../services/productService";
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
    GetProductById(id)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);
  console.log(product)

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
        <img
          component="img"
          src={`https://localhost:7137/images/Products/${product.imageUrl}`}
          alt={product.name}
        />
      </Box>
      <Box className="DetailsSide">
        <Box className="Title">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="h6" color="primary" fontWeight="bold">
            السعر: {product.price} ريال
          </Typography>
        </Box>
        <Box className="ColorOptions"></Box>
        <Box className="SizeOptions"></Box>
        <Box className="ActionButtons"></Box>
        <Box className="ExtraInfos">
        <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, whiteSpace: "pre-line" }}
          >
            {product.description || "لا يوجد وصف متاح لهذا المنتج."}
          </Typography>
        </Box>
      </Box>
      <Box className="YouWillLike"></Box>

    </Box>
  );
}
