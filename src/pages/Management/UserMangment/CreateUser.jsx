import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Alert,Card } from "@mui/material";
import { useState } from "react";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MuiCard from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useTranslation } from "react-i18next";
import { AddUser } from "../../../services/UsersService";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";


export default function CreateUser() {
  const { t } = useTranslation();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [PhoneNumberError, setPhoneNumberError] = useState(false);
  const [PhoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState("");
  const [birthDayError, setbirthDayError] = useState(false);
  const [birthDayErrorMessage, setbirthDayErrorMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const notify_Create = (info) => {
    toast.success(` ${info} `, {
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
    email: "",
    password: "",
    name: "",
    PhoneNumber: "",
    birthDay: "",
    clientFile: null,
  });
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    let isValid = true;

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!formData.PhoneNumber || !/^[\d]{9,}$/.test(formData.PhoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberErrorMessage("Please enter a valid phone number.");
      isValid = false;
    } else {
      setPhoneNumberError(false);
      setPhoneNumberErrorMessage("");
    }

    if (
      !formData.password ||
      formData.password.length < 6 ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
        formData.password
      )
    ) {
      setPasswordError(true);
      setPasswordErrorMessage(
        "Password must be at least 8 characters, contain upper/lowercase letters, number and special character."
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (
      !formData.name ||
      formData.name.length < 1 ||
      !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.name)
    ) {
      setNameError(true);
      setNameErrorMessage("Name is required or not valid.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!formData.birthDay || new Date(formData.birthDay) > new Date()) {
      setbirthDayError(true);
      setbirthDayErrorMessage("Birth date cannot be in the future.");
      isValid = false;
    } else {
      setbirthDayError(false);
      setbirthDayErrorMessage("");
    }

    return isValid;
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

    if (formData.clientFile) {
      formDataToSend.append("clientFile", formData.clientFile);
    }

    // طباعة محتوى formDataToSend
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const res = await AddUser(formDataToSend);
      if(res){
      
        notify_Create(res.data.message);
        event.target.reset();
      }
      else{
        setError(res.message ||"Register Faild")
      }

    } catch (error) {
      console.log(error)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          // لو الرسائل كثيرة، اعرضهم كلهم
          setError(messages.join("\n"));
        } else {
          // لو رسالة واحدة فقط
          setError(messages);
        }
      } else {
        console.log(error)
        setError("حدث خطأ غير معروف أثناء التسجيل.");
      }
    }
  };

  return (
<Box className="Card-Continer">
      <Card className="Card" variant="outlined">
          <ToastContainer/>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {t("Singup")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box position="relative" display="inline-block">
              {/* Hidden input */}
              <input
                id="clientFile"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
  
              {/* Label acts as clickable avatar */}
              <label htmlFor="clientFile" style={{ cursor: "pointer" }}>
                <Avatar
                  alt="Profile"
                  src={preview || "/static/images/avatar/1.jpg"}
                  sx={{
                    width: 100,
                    height: 100,
                    transition: "0.3s",
                  }}
                />
                {/* Camera icon overlay */}
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  bgcolor="white"
                  borderRadius="50%"
                  p={0.5}
                >
                  <AddAPhotoIcon fontSize="small" />
                </Box>
              </label>
            </Box>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="name">{t("Name")}</FormLabel>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="Jon Snow"
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? "error" : "primary"}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="PhoneNumber">{t("phone")}</FormLabel>
            <TextField
              autoComplete="PhoneNumber"
              name="PhoneNumber"
              required
              fullWidth
              id="PhoneNumber"
              placeholder="050********"
              error={PhoneNumberError}
              helperText={PhoneNumberErrorMessage}
              color={PhoneNumberError ? "error" : "primary"}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">{t("email")}</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? "error" : "primary"}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="birthDay">{t("birthDay")}</FormLabel>
            <TextField
              required
              fullWidth
              type="date"
              id="birthDay"
              placeholder="1990-01-01"
              name="birthDay"
              autoComplete="birthDay"
              variant="outlined"
              error={birthDayError}
              helperText={birthDayErrorMessage}
              color={birthDayError ? "error" : "primary"}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">{t("password")}</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? "error" : "primary"}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}
          </FormControl>
  
          <Button
            type="submit"
            sx={{
              backgroundColor: "rgb(56, 122, 122)",
              boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
            }}
            fullWidth
            variant="contained"
          >
            {t("Save")}
          </Button>
          <Button
            startIcon={<ArrowBack />}
            component={Link}
            to={`/users`}
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
