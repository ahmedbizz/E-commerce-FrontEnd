import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  Divider,
  Avatar,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import MuiAlert from "@mui/material/Alert";
import { GoogleIcon, FacebookIcon } from "../components/SignInComponents/CustomIcons";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    PhoneNumber: "",
    birthDay: "",
    clientFile: null,
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setFormData((prev) => ({ ...prev, clientFile: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("invalidEmail");
    if (!formData.PhoneNumber || !/^[\d]{9,}$/.test(formData.PhoneNumber))
      newErrors.PhoneNumber = t("invalidPhone");
    if (!formData.password || formData.password.length < 8)
      newErrors.password = t("invalidPassword");
    if (!formData.name || !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.name))
      newErrors.name = t("invalidName");
    if (!formData.birthDay || new Date(formData.birthDay) > new Date())
      newErrors.birthDay = t("invalidBirthDate");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("FullName", formData.name);
    formDataToSend.append("Email", formData.email);
    formDataToSend.append("Password", formData.password);
    formDataToSend.append("birthDay", formData.birthDay);
    formDataToSend.append("PhoneNumber", formData.PhoneNumber);
    if (formData.clientFile) formDataToSend.append("clientFile", formData.clientFile);

    try {
      const res = await register(formDataToSend);
      setOpen(true);
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setError(t("unknownError"));
    }
  };

  return (
    <Box className="signup-page">
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <CustomAlert severity="success">{success}</CustomAlert>
      </Snackbar>

      <Card className="signup-card">
        <Typography component="h1" className="signup-title">
          {t("signup")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className="signup-form">
          <FormControl className="signup-avatar">
            <Box className="avatar-wrapper">
              <input
                id="clientFile"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="clientFile" style={{ cursor: "pointer", display:"flex" , flexDirection:"column" }}>
                <Avatar alt="Profile" src={preview || "/static/images/avatar/1.jpg"} />
              
                <AddAPhotoIcon fontSize="small" />
               
              </label>
            </Box>
          </FormControl>

          <FormControl>
            <FormLabel>{t("fullName")}</FormLabel>
            <TextField
              name="name"
              placeholder={t("fullNamePlaceholder")}
              error={!!errors.name}
              helperText={errors.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t("phone")}</FormLabel>
            <TextField
              name="PhoneNumber"
              placeholder="050********"
              error={!!errors.PhoneNumber}
              helperText={errors.PhoneNumber}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t("email")}</FormLabel>
            <TextField
              name="email"
              placeholder="your@email.com"
              error={!!errors.email}
              helperText={errors.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t("birthDay")}</FormLabel>
            <TextField
              type="date"
              name="birthDay"
              error={!!errors.birthDay}
              helperText={errors.birthDay}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t("password")}</FormLabel>
            <TextField
              name="password"
              type="password"
              placeholder="••••••"
              error={!!errors.password}
              helperText={errors.password}
              onChange={handleChange}
            />
          </FormControl>

          {error && <Alert severity="error">{error}</Alert>}

          <FormControlLabel
            control={<Checkbox color="primary" />}
            label={t("receiveUpdates")}
          />

          <Button className="Button" type="submit" variant="contained" fullWidth>
            {t("signup")}
          </Button>
        </Box>

        <Divider className="divider">
          <Typography>{t("or")}</Typography>
        </Divider>

        <Box className="signup-social">
          <Button variant="outlined" startIcon={<GoogleIcon />}>
            {t("signupWithGoogle")}
          </Button>
          <Button variant="outlined" startIcon={<FacebookIcon />}>
            {t("signupWithFacebook")}
          </Button>
          <Typography>
            {t("alreadyHaveAccount")} <Link href="/login">{t("signin")}</Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
