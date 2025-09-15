import * as React from "react";
import { Alert, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { AddPaymentMethod } from "../../../services/PaymentMethodService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";

import "../../../styles/global.css";

const CreatePaymentMethod = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [type, setType] = useState("");
  const [otherData, setOtherData] = useState("{}"); // يمكن أن يكون JSON

  const [nameMessage, setNameMessage] = useState("");

  const notify_Create = (info) => {
    toast.success(`${info}`, {
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
    if (!name || name.trim().length < 2) {
      setNameMessage("Please enter a valid Name (at least 2 characters).");
      isValid = false;
    } else {
      setNameMessage("");
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("IsActive", isActive);
    formData.append("ApiKey", apiKey);
    formData.append("ApiSecret", apiSecret);
    formData.append("ApiUrl", apiUrl);
    formData.append("Type", type);
    formData.append("OtherData", otherData);

    try {
      const res = await AddPaymentMethod(formData);
      if (res) {
        notify_Create(res.data.message);
        setName(""); setApiKey(""); setApiSecret(""); setApiUrl(""); setType(""); setOtherData("{}"); setIsActive(true);
      } else {
        setError(res.message || "Failed to create PaymentMethod");
      }
    } catch (err) {
      setError("PaymentMethod create failed");
    }
  };

  return (
    <Box className="Card-Continer">
      <Card className="Card">
        <ToastContainer />

        <Typography component="h1" variant="h4" sx={{ width: "100%", fontPaymentMethod: "clamp(2rem, 10vw, 2.15rem)" }}>
          {t("Create PaymentMethod")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl>
            <FormLabel htmlFor="Name">{t("Name")}</FormLabel>
            <TextField value={name} onChange={(e) => setName(e.target.value)} error={!!nameMessage} helperText={nameMessage} id="Name" placeholder={t("Name")} required fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="ApiKey">{t("Api Key")}</FormLabel>
            <TextField value={apiKey} onChange={(e) => setApiKey(e.target.value)} id="ApiKey" placeholder={t("Api Key")} fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="ApiSecret">{t("Api Secret")}</FormLabel>
            <TextField value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} id="ApiSecret" placeholder={t("Api Secret")} fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="ApiUrl">{t("Api Url")}</FormLabel>
            <TextField value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} id="ApiUrl" placeholder={t("Api Url")} fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="Type">{t("Type")}</FormLabel>
            <TextField value={type} onChange={(e) => setType(e.target.value)} id="Type" placeholder={t("Type")} fullWidth />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="OtherData">{t("Other Data (JSON)")}</FormLabel>
            <TextField value={otherData} onChange={(e) => setOtherData(e.target.value)} id="OtherData" placeholder={t("Other Data in JSON")} multiline fullWidth />
          </FormControl>

          <FormControl sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormLabel>{t("Active")}</FormLabel>
            <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} color="primary" />
          </FormControl>

          <Button startIcon={<ArrowBack />} component={Link} to={`/System/PaymentMethods`} fullWidth variant="contained" sx={{ backgroundColor: "rgb(200, 122, 122)" }}>
            {t("Back")}
          </Button>

          <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: "rgb(56, 122, 122)" }}>
            {t("Save")}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CreatePaymentMethod;
