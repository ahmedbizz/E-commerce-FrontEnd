import * as React from "react";
import { Alert, CircularProgress ,Card} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UpdateBrandById, GetBrandByID } from "../../services/BransService";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom';
import ArrowBack from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Avatar from "@mui/material/Avatar";



const UpdateBrand = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: "",
    imageUrl: "",
    clientFile: null
  });
  const [error, setError] = useState("");
  const [NameError, setNameError] = useState(false);
  const [NameMessage, setNameMessage] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    GetBrandByID(id)
      .then((res) => {
        setFormData({
          Name: res.data.name || "",
          imageUrl: res.data.imageUrl || "",
          clientFile: null
        });
      })
      .catch((err) => setError("Failed to load Brand"))
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

    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, clientFile: file }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateInputs()) return;

    const data = new FormData();
    data.append("Name", formData.Name);
    if (formData.clientFile) data.append("clientFile", formData.clientFile);

    try {
      const res = await UpdateBrandById(data, id);
      if (res && res.data) {
        notify_Update(res.data.message || "Brand updated successfully");
      }
    } catch (err) {
      console.error(err);
      setError("Brand update failed. Please check all fields.");
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
          {t("Update Brand")}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Image */}
          <FormControl sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box position="relative" display="inline-block">
              <input type="file" id="clientFile" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              <label htmlFor="clientFile" style={{ cursor: "pointer" }}>
                <Avatar
                  variant="square"
                  alt="Brand"
                  src={preview || (formData.imageUrl ? `https://localhost:7137/images/Brands/${formData.imageUrl}` : "/public/Images/AddPic.webp")}
                  sx={{ width: "100%", height: "100%", transition: "0.3s" }}
                />
                <Box position="absolute" bottom={0} right={0} bgcolor="white" borderRadius="50%" p={0.5}>
                  <AddAPhotoIcon fontSize="small" />
                </Box>
              </label>
            </Box>
          </FormControl>

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



          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<ArrowBack />} component={Link} to="/Brands" variant="contained" fullWidth sx={{ backgroundColor: "rgb(200,122,122)" }}>
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

export default UpdateBrand;
