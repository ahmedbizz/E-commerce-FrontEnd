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
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { useTranslation } from "react-i18next";
import { AddToOrder } from "../services/OrederService";
import { formatPrice } from "/src/utils/formatPrice";
import { GetPaymentMethods } from "../services/PaymentMethodService";
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { t } = useTranslation();
  const {
    cartItems,
    fetchCart,
    DeleteItemById,
    IncreaseItemById,
    DecreaseItemById,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [soldOut, setsoldOut] = useState(false);
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);
  const [Loading, setLoading] = useState(false);


  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    fetchPaymentMethods();
    fetchCart();
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
    (acc, item) => acc + ((item.quantity * item.unitPrice) +(item.quantity * item.unitPrice)*item.tax ),
    0
  );
  const vat = cartItems.reduce(
    (acc, item) => acc + ((item.quantity * item.unitPrice)*item.tax ),
    0
  );
  const totalWithVat = totalPrice ;
  
  
  useEffect(() => {
    const isSoldOut = cartItems.some((item) => item.stockQuantity === 0);
    setsoldOut(isSoldOut);
  }, [cartItems]);

  const handelOrder = async () => {
    setLoading(true);
    const data = {
      TotalAmount: totalPrice,
      PaymentMethodId: paymentMethod,
      DeliveryRequestId: 1,
      OrderItems: cartItems.map((item) => ({
        ProductId: item.productId,
        Quantity: item.quantity,
        unitPrice: item.unitPrice,
        SizeId: item.sizeId,
      })),
    };

    try {
      const res = await AddToOrder(data);

      if (res.data?.approvalUrl) {
        window.location.href = res.data.approvalUrl;
      } else if (res.data?.paymentMethod === "CashOnDelivery") {
        fetchCart();
        alert(t("Order created successfully! Cash on delivery."));
      } else {
        console.warn(t("No payment approval URL provided."));
      }
    } catch (err) {
      console.error(err);
      alert(t("An error occurred while placing the order. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (Loading)
    return (
      <Box className="loading">
        <CircularProgress size={80} />
      </Box>
    );

  return (
    <Box className="CartContiner">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🛒{t("Cart")}
      </Typography>

      {cartItems.length === 0 ? (
        <Box className="empty-cart">
          <InventoryOutlinedIcon sx={{ fontSize: 80, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">
            {t("There are no item added yet.")}
          </Typography>
        </Box>
      ) : (
        <>
      
          {!isMobile ? (
            <Table className="Table">
              <TableHead className="TableHead">
                <TableRow>
                  <TableCell align="center">{t("Image")}</TableCell>
                  <TableCell>{t("Name")}</TableCell>
                  <TableCell>{t("Size")}</TableCell>
                  <TableCell align="center">{t("Price")}</TableCell>
                  <TableCell align="center">{t("Quantity")}</TableCell>
                  <TableCell align="center">{t("VAT")}</TableCell>
                  <TableCell align="center">{t("Amount")}</TableCell>
                  <TableCell align="center">{t("Amount + VAT")}</TableCell>
                  <TableCell align="center">{t("Action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => 
                
                {      
                  
                  var tax = item.tax *(item.quantity * item.unitPrice);
                  var amount =item.quantity * item.unitPrice;
                  return(



                  <TableRow key={item.id} className="TableRow">
                    <TableCell align="center">
                      <img
                        onClick={()=>navigate(`/product/${item.id}`)}
                        src={`${import.meta.env.VITE_BASE_URL}/images/Products/${item.productImage}`}
                        alt={item.productName}
                        className="product-img"
                      />
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.sizeName}</TableCell>
                    <TableCell align="center">
                      {formatPrice(item.unitPrice)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => DecreaseItemById(item.id)}>
                        <RemoveIcon />
                      </IconButton>
                      {item.quantity}
                      <IconButton onClick={() => IncreaseItemById(item.id)}>
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {formatPrice(tax)}
                    </TableCell>
                    <TableCell align="center">
                      {formatPrice(amount)}
                    </TableCell>
                    <TableCell align="center">
                      {formatPrice(tax + amount)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => DeleteItemById(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          ) : (
            <Box className="mobile-cards">
              {cartItems.map((item) => (
                <Box key={item.id} className="cart-card">
                  <div className="row-top">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/images/Products/${item.productImage}`}
                      alt={item.productName}
                    />
                    <Typography className="product-name">
                      {item.productName}
                    </Typography>
                  </div>
                  <div className="row-bottom">
                    <Typography className="price">
                      {formatPrice(item.unitPrice * item.quantity )}
                    </Typography>
                    <div className="quantity-control">
                      <IconButton onClick={() => DecreaseItemById(item.id)}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton onClick={() => IncreaseItemById(item.id)}>
                        <AddIcon />
                      </IconButton>
                    </div>
                    <IconButton
                      className="delete-btn"
                      onClick={() => DeleteItemById(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Box>
              ))}
            </Box>
          )}

      

        
          <Box className="cart-summary">
            <Box className="PaymentMethod">
              <Typography variant="h6" fontWeight="bold">
              {t("Payment Method")}
              </Typography>
              <RadioGroup
            className="RadioGroup"
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

            <Box className="AmountPrice" >
              <Typography variant="h6" fontWeight="bold">
              {t("Amount + Tax")}
              </Typography>
<TableBody>
<TableRow className="TableRow">  
<TableCell>{t("Amount")}</TableCell> 
    <TableCell>{formatPrice(totalPrice)}</TableCell>    
</TableRow>


<TableRow className="TableRow">  
<TableCell>{t("TAX")}</TableCell> 
    <TableCell>{formatPrice(vat)}</TableCell>    
</TableRow>
<TableRow className="TableRow">  
<TableCell>{t("Amount + TAX")}</TableCell> 
    <TableCell>              
      <Typography variant="h5" color="primary" fontWeight="bold">
                {formatPrice(totalWithVat)}
      </Typography></TableCell>    
</TableRow>

</TableBody>


            </Box>
          </Box>

          <Box textAlign="center" mt={3}>
            {!soldOut && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 3, px: 5 }}
                onClick={handelOrder}
              >
                إتمام الطلب
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
