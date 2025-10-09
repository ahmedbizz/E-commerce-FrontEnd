import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography
} from '@mui/material';
import {formatPrice} from "/src/utils/formatPrice"



const ProductCard = React.memo(({ product }) =>{
  const navigate = useNavigate();
  return (
    <Card  className='Card-Product'>
<CardMedia className='CardMedia'>
<img src={`${import.meta.env.VITE_BASE_URL}/images/Products/${product.imageUrl}`} alt={product.name}   onClick={()=>navigate(`/product/${product.id}`)} />
</CardMedia>
    
      <CardContent className='CardContent'>
        <Typography gutterBottom variant="h6" component="div" noWrap className='title'>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className='Description'>
          {product.description?.slice(0, 50)}...
        </Typography>
        <Typography variant="subtitle1" color="primary" mt={1} className='Price'>
          {formatPrice(product.price)} 
        </Typography>
      </CardContent>

    </Card>
  );
});
export default ProductCard;
