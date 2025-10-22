import * as React from "react";
import { Alert, CircularProgress ,Card} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UpdateTaxCategoryById, GetTaxCategoryByID } from "../../../services/TaxesService";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom';
import ArrowBack from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Avatar from "@mui/material/Avatar";
import "../../../styles/global.css";



const UpdateTaxCategory = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: "",
    Rate: "",
    imageUrl: "",
    clientFile: null
  });
  const [error, setError] = useState("");
  const [NameError, setNameError] = useState(false);
  const [NameMessage, setNameMessage] = useState("");
  const [RateError, setRateError] = useState(false);
  const [RateMessage, setRateMessage] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    GetTaxCategoryByID(id)
      .then((res) => {
        setFormData({
          Name: res.data.name || "",
          Rate: res.data.rate || "",
      
      
        });
      })
      .catch((err) =>{ 
      if (error.response && error.response.data) {
        const { errors, message } = error.response.data;
    
        if (errors && typeof errors === "object") {
          // نستخرج كل رسائل الأخطاء من الـ object
          const allErrors = Object.values(errors).flat();
          setError(allErrors.join("\n"));
          return;
        }
    
        if (Array.isArray(message)) {
      
          setError(message.join("\n"));
          return;
        }
    
        if (typeof message === "string") {
          setError(message);
      
          return;
        }
      }
      setError(t("errorr_message"));})
      .finally(() => setLoading(false));
  }, [id]);

  const notify_Update = (info) => {
    toast.success(info, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const validateInputs = () => {
    let isValid = true;

    if (!formData.Name || formData.Name.trim().length < 2) {
      setNameError(true);
      setNameMessage("Name must be at least 2 characters");
      isValid = false;
    } else {
      setNameError(false);
      setNameMessage("");
    }

    if (!formData.Rate || formData.Rate.trim().length < 2) {
      setRateError(true);
      setRateMessage("Rate must be at least 2 characters");
      isValid = false;
    } else {
      setRateError(false);
      setRateMessage("");
    }

    return isValid;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateInputs()) return;

    const data = new FormData();
    data.append("Name", formData.Name);
    data.append("Rate", formData.Rate);
  

    try {
      const res = await UpdateTaxCategoryById(data, id);
      if (res && res.data) {
        notify_Update(res.data.message || "TaxCategory updated successfully");
      }
    } catch (err) {
      console.error(err);
      setError("TaxCategory update failed. Please check all fields.");
    }
  };

  if (Loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box className="Card-Continer">
      <Card className="Card" variant="outlined">
        <ToastContainer />
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontTaxCategory: "clamp(2rem, 10vw, 2.15rem)" }}>
          {t("Update TaxCategory")}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}



          {/* Name */}
          <FormControl>
            <FormLabel htmlFor="Name">{t("Name")}</FormLabel>
            <TextField
              error={NameError}
              helperText={NameMessage}
              value={formData.Name}
              onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
              id="Name"
              name="Name"
              placeholder={t("Name")}
              required
              fullWidth
              variant="outlined"
              color={NameError ? "error" : "primary"}
            />
          </FormControl>

          {/* Rate */}
          <FormControl>
            <FormLabel htmlFor="Rate">{t("Rate")}</FormLabel>
            <TextField
              error={RateError}
              helperText={RateMessage}
              value={formData.Rate}
              onChange={(e) => setFormData(prev => ({ ...prev, Rate: e.target.value }))}
              id="Rate"
              name="Rate"
              placeholder={t("Rate")}
              required
              fullWidth
              variant="outlined"
              color={RateError ? "error" : "primary"}
            />
          </FormControl>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<ArrowBack />} component={Link} to="/System/Taxes" variant="contained" fullWidth sx={{ backgroundColor: "rgb(200,122,122)" }}>
              {t("Back")}
            </Button>
            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "rgb(56,122,122)" }}>
              {t("Save")}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default UpdateTaxCategory;
