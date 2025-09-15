import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,Typography,Card,
  Autocomplete
   
} from "@mui/material";
import { addInventory } from "../../../services/InventoryService";
import { GetWareHouses } from "../../../services/WareHouseService";
import { GetProducts } from "../../../services/productService";

import { ToastContainer, toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import { useTranslation } from "react-i18next";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

export default function CreateInventory() {
  const { t } = useTranslation();
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

  const [Warehouses, setWarehouses] = useState([]);
  const [Products, setProducts] = useState([]);
  const [Filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [options, setOptions] = useState([]);
  const [loadingOpt, setLoadingOpt] = useState(false);

  useEffect(() => {
  
    async function fetchData() {
      try {
        const warehouses = await GetWareHouses();
      
        setWarehouses(warehouses.data.items || []);


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

  const handleSearch = async (event) => {
  
      const query = event.target.value;
      if (!query) {
        const products = await GetProducts({SearchTerm:query});
        console.log(products.data.items)
        setProducts(products.data.items || []);
        setOptions(Products); // إذا خانة البحث فارغة، نعرض كل العناصر
        return;
      }
  
      const filtered = Products.filter((us) =>
        us.name.toLowerCase().includes(query.toLowerCase())
      
        );
        setOptions(filtered);
  
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

    var res =  await addInventory(data);
    console.log(res)
    if(res.data){
      notify(t("add_success"))
      setSuccess(t("add_success"));
      setFormData({
        Quantity: "",
        ProductId: "",
        WarehouseId: "",
      });
    }

    } catch (err) {
      console.log(err.response.data)
      setError(t("errorr_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
<Box className="Card-Continer">
      <Card className="Card" variant="outlined">
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
  
          <FormControl fullWidth>
  <Autocomplete
    options={options}
    getOptionLabel={(option) => option.name || ""}
    loading={loadingOpt}
    onInputChange={async (_, value) => {
      if (!value) {
        setOptions([]);
        return;
      }
      setLoadingOpt(true);
      try {
        const res = await GetProducts({ SearchTerm: value, Page: 1, PageSize: 20 });
        setOptions(res.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOpt(false);
      }
    }}
    onChange={(_, newValue) => {
      setFormData((prev) => ({
        ...prev,
        ProductId: newValue ? newValue.id : "",
      }));
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label={t("Select Product")}
        variant="outlined"
        required
      />
    )}
  />
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
  
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{backgroundColor:"rgb(56, 122, 122)",boxShadow:"0px 6px 0px rgb(240, 240, 175, 1)"}}>
            {loading ? <CircularProgress size={24} /> : t("Save")}
          </Button>
          <Button
            startIcon={<ArrowBack />}
            component={Link}
            to={`/System/inventorys`}
            sx={{
              backgroundColor: "rgb(200, 122, 122)",
              boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
            }}
            fullWidth
            variant="contained"
          >
            {t("Back")}
          </Button>
        </Box>
      </Card>
</Box>
  );
}
