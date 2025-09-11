import { useContext, useState , useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { useTranslation } from "react-i18next";
import {AddToOrder} from "../services/OrederService"
export default function Cart() {
  const { t } = useTranslation();
  const { cartItems, fetchCart, DeleteItemById ,IncreaseItemById ,DecreaseItemById } = useContext(CartContext);
  const { user} = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  useEffect(() => {
    fetchCart();
  }, []);



  const handelOrder = ()=>{
    const data ={
      TotalAmount: totalPrice,
      PaymentId: 1,
      DeliveryRequestId: 1,
      OrderItems: cartItems
    }
    console.log(data)
    try{
      const res= AddToOrder(data);
      console.log(res)

    }catch(err){
      console.log(err)
    }

  }

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🛒 سلة المشتريات
      </Typography>

      {cartItems.length === 0 ? (
      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 2,
        textAlign: "center",
      }}
    >
      <InventoryOutlinedIcon sx={{ fontSize: 80, color: "text.secondary" }} />
      <Typography variant="h6" color="text.secondary">
        {t("There are no item added yet.")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("isEmpty_add")}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigete("/product/create")} // أو أي مسار إضافة المنتج
      >
        {t("new_item")}
      </Button>
    </Box>
      ) : (
        <>
          <Table sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
            <TableHead sx={{ bgcolor: "grey.200" }}>
              <TableRow>
                <TableCell align="center">{t("Image")}</TableCell>
                <TableCell>{t("Name")}</TableCell>
                <TableCell>Size</TableCell>
                <TableCell align="center">السعر</TableCell>
                <TableCell align="center">الكمية</TableCell>
                <TableCell align="center">الإجمالي</TableCell>
                <TableCell align="center">إجراء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell align="center">
                    <img
                      src={`https://localhost:7137/images/Products/${item.productImage}`}
                      alt={item.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="500">{item.productName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="500">{item.selectedSize}</Typography>
                  </TableCell>
                  <TableCell align="center">{item.unitPrice} ريال</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() =>
                        DecreaseItemById(item.id)
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography
                      component="span"
                      sx={{ mx: 1, fontWeight: "bold" }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        console.log(item)
                        IncreaseItemById(item.id)}}
                    >
                      <AddIcon />
                    </IconButton>
                    
                  </TableCell>
                  <TableCell align="center">
                    {item.quantity * item.unitPrice} ريال
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => {DeleteItemById(item.id)
                      
                      fetchCart();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 3 }} />

          {/* ملخص السلة */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={3}
          >
            {/* اختيار طريقة الدفع */}
            <Box>
              <Typography variant="h6" gutterBottom>
                طريقة الدفع
              </Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="كاش"
                />
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="شبكة"
                />
              </RadioGroup>
            </Box>

            {/* الإجمالي */}
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="bold">
                الإجمالي الكلي:
              </Typography>
              <Typography
                variant="h5"
                color="primary"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {totalPrice} ريال
              </Typography>
            </Box>
          </Box>

          {/* زر إتمام الشراء */}
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 3, px: 5 }}
              onClick={()=>handelOrder()}
            >
              إتمام الطلب
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
