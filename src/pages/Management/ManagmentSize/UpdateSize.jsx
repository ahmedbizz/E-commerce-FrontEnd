import * as React from "react";
import { Alert, CircularProgress ,Card} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UpdateSizeById, GetSizeByID } from "../../../services/SizeService";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom';
import ArrowBack from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Avatar from "@mui/material/Avatar";
import "../../../styles/global.css";



const UpdateSize = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: "",
    Type: "",
    imageUrl: "",
    clientFile: null
  });
  const [error, setError] = useState("");
  const [NameError, setNameError] = useState(false);
  const [NameMessage, setNameMessage] = useState("");
  const [TypeError, setTypeError] = useState(false);
  const [TypeMessage, setTypeMessage] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    GetSizeByID(id)
      .then((res) => {
        setFormData({
          Name: res.data.name || "",
          Type: res.data.type || "",
      
      
        });
      })
      .catch((err) => setError("Failed to load Size"))
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

    if (!formData.Type || formData.Type.trim().length < 2) {
      setTypeError(true);
      setTypeMessage("Type must be at least 2 characters");
      isValid = false;
    } else {
      setTypeError(false);
      setTypeMessage("");
    }

    return isValid;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateInputs()) return;

    const data = new FormData();
    data.append("Name", formData.Name);
    data.append("Type", formData.Type);
  

    try {
      const res = await UpdateSizeById(data, id);
      if (res && res.data) {
        notify_Update(res.data.message || "Size updated successfully");
      }
    } catch (err) {
      console.error(err);
      setError("Size update failed. Please check all fields.");
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
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          {t("Update Size")}
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

          {/* Type */}
          <FormControl>
            <FormLabel htmlFor="Type">{t("Type")}</FormLabel>
            <TextField
              error={TypeError}
              helperText={TypeMessage}
              value={formData.Type}
              onChange={(e) => setFormData(prev => ({ ...prev, Type: e.target.value }))}
              id="Type"
              name="Type"
              placeholder={t("Type")}
              required
              fullWidth
              variant="outlined"
              color={TypeError ? "error" : "primary"}
            />
          </FormControl>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<ArrowBack />} component={Link} to="/Sizes" variant="contained" fullWidth sx={{ backgroundColor: "rgb(200,122,122)" }}>
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

export default UpdateSize;
