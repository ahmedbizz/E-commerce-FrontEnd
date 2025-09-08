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
      <CardMedia
      
      onClick={()=>navigate(`/product/${product.id}`)}
              
        component="img"
        width="100%"
        sx={{
          maxHeight:"400px",
          objectFit:"cover",
          cursor:"pointer"
        }}
        image={`https://localhost:7137/images/Products/${product.imageUrl}`}
        alt={product.name}
        loading="lazy"
      />
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
