import { Box ,Button} from '@mui/material';
import {useState ,useEffect}from 'react';
import {GetBrands ,GetProductsByBrand} from "../../services/BransService"
import { useNavigate } from 'react-router-dom';

const Panel = () => {
  const navigate = useNavigate();
  const [brandsRes, setbrands] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {  
        const brandsRes = await GetBrands();
        setbrands(brandsRes.data.items);
      } catch(err) {
        setbrands([]);
      }
    }
    fetchData();
  }, []);



    const handleBransClick = (brand) => {
    
      const params = new URLSearchParams();
      params.set("brandId", brand.id);
      navigate(`products/all?${params.toString()}`);
    };

  return (
<Box className="Panel-container">
      <Box
      className="Box-Panel"
      >
        {brandsRes.map((brand, index) => (
          <Box
          className='ImageBox'
            key={index}

          >
            <Box
        
              component="img"
              src={`${import.meta.env.VITE_BASE_URL}/images/Brands/${brand.imageUrl}`}
              alt={`Image ${index + 1}`}
              sx={{
                width: "100%",
                height: "70vh",
                objectFit: "cover",
              }}
            />
            <div className="overlay"></div>
             <Button variant="contained" className="GO_TO_SHOP_BT" onClick={()=>{
                  handleBransClick(brand);
              
             }} >Shop</Button>
          </Box>
        ))}
        </Box>
</Box >
  );
}

export default Panel;
