import { useContext, useState, useEffect } from "react";
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
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { useTranslation } from "react-i18next";
import { AddToOrder } from "../services/OrederService";
import { formatPrice } from "/src/utils/formatPrice";
import {GetPaymentMethods} from "../services/PaymentMethodService";
export default function Cart() {
  const { t } = useTranslation();
  const {
    cartItems,
    fetchCart,
    DeleteItemById,
    IncreaseItemById,
    DecreaseItemById,
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [soldOut, setsoldOut] = useState(false);
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  
  const fetchPaymentMethods = async () => {
    try {
      const res = await GetPaymentMethods();
      setPaymentMethodsList(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  useEffect(() => {
    
    const isSoldOut = cartItems.some(item => item.stockQuantity === 0);
    setsoldOut(isSoldOut);
  }, [cartItems]);

  useEffect(() => {
    fetchCart();
  }, []);

  const handelOrder = async () => {
    setLoading(true);
    const data = {
      TotalAmount: totalPrice,
      PaymentMethodId: paymentMethod, // تأكد من نفس اسم المفتاح
      DeliveryRequestId: 1,
      OrderItems: cartItems.map(item => ({
        ProductId: item.productId,
        Quantity: item.quantity,
        unitPrice: item.unitPrice,
        SelectedSize: item.selectedSize
      })),
    };
  console.log(data)
    try {
      const res = await AddToOrder(data);
      console.log(res.data);
      
      if (res.data?.approvalUrl) {
          // إعادة توجيه لموقع PayPal
          window.location.href = res.data.approvalUrl;
          setLoading(false);
      } else if (res.data?.paymentMethod === "CashOnDelivery") {
          // عرض رسالة نجاح للـ COD
          alert("تم إنشاء الطلب بنجاح! الدفع عند الاستلام.");
          setLoading(false);
      } else {
          // أي نوع دفع آخر أو خطأ
          console.warn("لا يوجد رابط للموافقة على الدفع.");
          setLoading(false);
      }
      
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("حدث خطأ أثناء إتمام الطلب، حاول مرة أخرى.");
    }
  };
  
  if (Loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={80} />
      </Box>
    );
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
          <InventoryOutlinedIcon
            sx={{ fontSize: 80, color: "text.secondary" }}
          />
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
                    <Box sx={{ position: "relative", display: "inline-block" }}>
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
                      {item.stockQuantity == 0?
                                  <Box
                                  sx={{
                                    position: "absolute",
                                    top: "20px",
                                    left: "-5px",
                                    backgroundColor: "red",
                                    color: "white",
                                    fontWeight: "bold",
                                    transform: "rotate(-22deg)",
                                    padding: "1px 6px",
                                    textAlign: "center",
                                    fontSize: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                    width: "70px",
                                  }}
                                >
                                  Sold Out
                                </Box>  
                      :<></>}
        
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="500">{item.productName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="500">
                      {item.selectedSize}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{formatPrice(item.unitPrice)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => DecreaseItemById(item.id)}>
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
                        console.log(item);
                        IncreaseItemById(item.id);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    {formatPrice(item.quantity * item.unitPrice)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => {
                        DeleteItemById(item.id);

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
  onChange={(e) => setPaymentMethod(Number(e.target.value))}
>
  {paymentMethodsList.map((method) => (
    <FormControlLabel
      key={method.id}
      value={method.id}
      control={<Radio />}
      label={method.name}
    />
  ))}
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
                {formatPrice(totalPrice)} 
              </Typography>
            </Box>
          </Box>

          {/* زر إتمام الشراء */}
          <Box textAlign="center" mt={3}>
            {!soldOut?            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 3, px: 5 }}
              onClick={() => handelOrder()}
            >
              إتمام الطلب
            </Button>:<></>}

          </Box>
        </>
      )}
    </Box>
  );
}
