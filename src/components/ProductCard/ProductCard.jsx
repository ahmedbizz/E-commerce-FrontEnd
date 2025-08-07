import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import {formatPrice} from "/src/utils/formatPrice"

export default function ProductCard({ product }) {

  return (
    <Card sx={{ maxWidth: 300, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={`https://localhost:7137/images/Products/${product.imageUrl}`}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description?.slice(0, 50)}...
        </Typography>
        <Typography variant="subtitle1" color="primary" mt={1}>
          {formatPrice(product.price)} 
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          component={Link}
          to={`/product/${product.id}`}
          size="small"
          variant="outlined"
        >
          عرض التفاصيل
        </Button>
      </CardActions>
    </Card>
  );
}
