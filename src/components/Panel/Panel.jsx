import { Box ,Button} from '@mui/material';
import {useState ,useEffect}from 'react';
import {GetBrands} from "../../services/BransService"

const Panel = () => {
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

  return (
<Box className="Panel-container">
      <Box
      className="Box-Panel"
        sx={{

        }}
      >
        {brandsRes.map((brand, index) => (
          <Box
          className='ImageBox'
            key={index}

          >
            <Box
        
              component="img"
              src={`https://localhost:7137/images/Brands/${brand.imageUrl}`}
              alt={`Image ${index + 1}`}
              sx={{
                width: "100%",
                height: "70vh",
                objectFit: "cover",
              }}
            />
            <div className="overlay"></div>
             <Button variant="contained" className="GO_TO_SHOP_BT" onClick={()=>{
                  const scrollHeight = document.documentElement.scrollHeight; // طول الصفحة
                  const viewportHeight = window.innerHeight; // طول الشاشة
                  const targetPosition = scrollHeight - viewportHeight * 0.75; // قبل النهاية بـ 3/4 الشاشة
              
                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth", // نزول سلس
                  });
             }} >Shop</Button>
          </Box>
        ))}
        </Box>
</Box >
  );
}

export default Panel;
