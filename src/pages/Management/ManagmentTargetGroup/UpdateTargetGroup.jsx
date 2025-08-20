import * as React from "react";
import { Alert, CircularProgress ,Card} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { UpdateTargetGroupById, GetTargetGroupByID } from "../../../services/TargetGroupService";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom';
import ArrowBack from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Avatar from "@mui/material/Avatar";
import "../../../styles/global.css";



const UpdateTargetGroup = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: "",

  });
  const [error, setError] = useState("");
  const [NameError, setNameError] = useState(false);
  const [NameMessage, setNameMessage] = useState("");


  useEffect(() => {
    GetTargetGroupByID(id)
      .then((res) => {
        setFormData({
          Name: res.data.name || "",
        
      
      
        });
      })
      .catch((err) => setError("Failed to load TargetGroup"))
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


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateInputs()) return;

    const data = new FormData();
    data.append("Name", formData.Name);

    try {
      const res = await UpdateTargetGroupById(data, id);
      if (res && res.data) {
        notify_Update(res.data.message || "TargetGroup updated successfully");
      }
    } catch (err) {
      console.error(err);
      setError("TargetGroup update failed. Please check all fields.");
    }
  };

  if (Loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress TargetGroup={80} />
      </Box>
    );
  }

  return (
    <Box className="Card-Continer">
      <Card className="Card" variant="outlined">
        <ToastContainer />
        <Typography component="h1" variant="h4" sx={{ width: "100%", fontTargetGroup: "clamp(2rem, 10vw, 2.15rem)" }}>
          {t("Update TargetGroup")}
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



          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<ArrowBack />} component={Link} to="/TargetGroups" variant="contained" fullWidth sx={{ backgroundColor: "rgb(200,122,122)" }}>
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

export default UpdateTargetGroup;
