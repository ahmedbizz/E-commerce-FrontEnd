import * as React from "react";
import { Alert, CircularProgress, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { UpdatePaymentMethodById, GetPaymentMethodByID } from "../../../services/PaymentMethodService";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom';
import ArrowBack from "@mui/icons-material/ArrowBack";
import "../../../styles/global.css";

const UpdatePaymentMethod = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [NameError, setNameError] = useState(false);
  const [NameMessage, setNameMessage] = useState("");

  const [formData, setFormData] = useState({
    Name: "",
    ApiKey: "",
    ApiSecret: "",
    ApiUrl: "",
    Type: "",
    OtherData: "{}",
    IsActive: true,
  });

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    GetPaymentMethodByID(id)
      .then((res) => {
        setFormData({
          Name: res.data.name || "",
          ApiKey: res.data.apiKey || "",
          ApiSecret: res.data.apiSecret || "",
          ApiUrl: res.data.apiUrl || "",
          Type: res.data.type || "",
          OtherData: res.data.otherData || "{}",
          IsActive: res.data.isActive || false,
        });
        setIsActive(res.data.isActive || false);
      })
      .catch(() => setError("Failed to load PaymentMethod"))
      .finally(() => setLoading(false));
  }, [id]);

  const notify_Update = (info) => {
    toast.success(info, { position: "top-center", autoClose: 5000, theme: "light" });
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
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!validateInputs()) return;

    const data = new FormData();
    data.append("Name", formData.Name);
    data.append("ApiKey", formData.ApiKey);
    data.append("ApiSecret", formData.ApiSecret);
    data.append("ApiUrl", formData.ApiUrl);
    data.append("Type", formData.Type);
    data.append("OtherData", formData.OtherData);
    data.append("IsActive", isActive);

    try {
      const res = await UpdatePaymentMethodById(data, id);
      if (res && res.data) {
        notify_Update(res.data.message || "PaymentMethod updated successfully");
      }
    } catch (err) {
      setError("PaymentMethod update failed. Please check all fields.");
    }
  };

  if (Loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress size={80} />
    </Box>
  );

  return (
    <Box className="Card-Continer">
      <Card className="Card" variant="outlined">
        <ToastContainer />
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          {t("Update PaymentMethod")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl>
            <FormLabel htmlFor="Name">{t("Name")}</FormLabel>
            <TextField
              error={NameError}
              helperText={NameMessage}
              value={formData.Name}
              onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
              id="Name" required fullWidth variant="outlined" color={NameError ? "error" : "primary"}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="ApiKey">{t("Api Key")}</FormLabel>
            <TextField value={formData.ApiKey} onChange={(e) => setFormData(prev => ({ ...prev, ApiKey: e.target.value }))} id="ApiKey" fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="ApiSecret">{t("Api Secret")}</FormLabel>
            <TextField value={formData.ApiSecret} onChange={(e) => setFormData(prev => ({ ...prev, ApiSecret: e.target.value }))} id="ApiSecret" fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="ApiUrl">{t("Api Url")}</FormLabel>
            <TextField value={formData.ApiUrl} onChange={(e) => setFormData(prev => ({ ...prev, ApiUrl: e.target.value }))} id="ApiUrl" fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="Type">{t("Type")}</FormLabel>
            <TextField value={formData.Type} onChange={(e) => setFormData(prev => ({ ...prev, Type: e.target.value }))} id="Type" fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="OtherData">{t("Other Data (JSON)")}</FormLabel>
            <TextField value={formData.OtherData} onChange={(e) => setFormData(prev => ({ ...prev, OtherData: e.target.value }))} id="OtherData" multiline fullWidth />
          </FormControl>

          <FormControl sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormLabel>{t("Active")}</FormLabel>
            <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="primary" />
          </FormControl>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<ArrowBack />} component={Link} to="/System/PaymentMethods" variant="contained" fullWidth sx={{ backgroundColor: "rgb(200,122,122)" }}>
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

export default UpdatePaymentMethod;
