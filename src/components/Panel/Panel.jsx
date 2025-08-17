import { Box ,Button} from '@mui/material';
import React from 'react';

const Panel = () => {
  const images = [
    "../../public/Images/pexels-avneet-kaur-669191817-19294576.jpg",
    "../../public/Images/pexels-craytive-1503009.jpg",
    "../../public/Images/pexels-marcus-queiroga-silva-86421404-12363437.jpg",
    "../../public/Images/pexels-wesleydavi-15336560.jpg",
  ];
  return (
<Box className="Panel-container">
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // عمودين
          gridTemplateRows: "1fr 1fr", // صفين
          gap: "10px", // المسافة بين الصور
          p: "0px", // مسافة من الحواف الخارجية
          boxSizing: "border-box",
        }}
      >
        {images.map((img, index) => (
          <Box
          className='ImageBox'
            key={index}
            sx={{
              width: "100%",
              height: "100%",
              overflow: "hidden",      
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <Box
        
              component="img"
              src={img}
              alt={`Image ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
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
