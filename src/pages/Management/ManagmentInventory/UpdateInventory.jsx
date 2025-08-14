import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,Typography
} from "@mui/material";
import { GetInventoryById,UpdateInventoryById } from "../../../services/InventoryService";
import { GetWareHouses } from "../../../services/WareHouseService";
import { GetProducts } from "../../../services/productService";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  // maxHeight: '100dvh', // لتجنب تجاوز الشاشة
  // overflowY: 'auto',    // لإظهار سكرول إذا زاد المحتوى
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));
export default function UpdateInventory() {
  const { t } = useTranslation();
  const { id } = useParams();
  const notify = (value) => {
    toast.success(`${value} `, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const notify_Error = (value) => {
    toast.error();(`${value} `, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const [formData, setFormData] = useState({
    WarehouseId: "",
    ProductId: "",
    Quantity: "",
  });
  useEffect(() => {
    GetInventoryById(id)
      .then((res) =>
  {    console.log(res.data)
        setFormData({
          WarehouseId: res.data.warehouseId || "",
          ProductId: res.data.productId || "",
          Quantity: res.data.quantity || "",

        })}
      )
      .catch((err) => {
        notifyErorr(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const [Warehouses, setWarehouses] = useState([]);
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // تحميل القوائم من الـ API
    async function fetchData() {
      try {
        const warehouses = await GetWareHouses();
      
        setWarehouses(warehouses.data.items || []);

        const products = await GetProducts();
        setProducts(products.data.items || []);
      } catch {
        setError(t("errorr_message"));
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isNaN(formData.Quantity) || Number(formData.Quantity) <= 0) {
      setError("الكمية يجب أن يكون رقماً أكبر من الصفر.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

    var res =  await UpdateInventoryById(data,id);
    console.log(res)
    if(res.data){
      notify(t("update_success"))
      setSuccess(t("update_success"));

    }

    } catch (err) {
    
      setError(t("errorr_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined">
      <ToastContainer />
      <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          {t("Add product to WareHouse")}
        </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl>
          <Select
            name="WarehouseId"
            required
            value={formData.WarehouseId}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">
              <em>
                {t("Select")}-{t("Warehouses")}
              </em>
            </MenuItem>
            {(Warehouses || []).map((wh) => (
              <MenuItem key={wh.id} value={wh.id}>
                {wh.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <Select
            name="ProductId"
            required
            value={formData.ProductId}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">
              <em>
                {t("Select")}-{t("Products")}
              </em>
            </MenuItem>
            {(Products || []).map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <TextField
            label={t("Quantity")}
            required
            name="Quantity"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.Quantity}
            onChange={handleChange}
          />
        </FormControl>

        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : t("Save")}
        </Button>
      </Box>
    </Card>
  );
}
