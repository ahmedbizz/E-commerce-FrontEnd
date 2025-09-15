import * as React from "react";
import { Alert, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AddCategory } from "../../../services/CategoryService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import "../../../styles/global.css";

const CreateCategory = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [descriptionMessage, setDescriptionMessage] = useState("");
  const [clientFile, setClientFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
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
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    if (clientFile) {
      formData.append("clientFile", clientFile);
    }

    try {
      const res = await AddCategory(formData);
      if (res) {
        notify_Create(res.data.message);
        setName("");
        setDescription("");
        setClientFile(null);
        setPreview(null);
      } else {
        setError(res.message || "Name or Description is invalid");
      }
    } catch (err) {
      console.log(err);
      setError("Category create failed");
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!name || !/^[a-zA-Z0-9 ]{3,}$/.test(name)) {
      setNameMessage("Please enter a valid Name (at least 3 characters).");
      isValid = false;
    } else {
      setNameMessage("");
    }

    if (!description || !/^[a-zA-Z0-9 ]{3,}$/.test(description)) {
      setDescriptionMessage(
        "Please enter a valid Description (at least 3 characters)."
      );
      isValid = false;
    } else {
      setDescriptionMessage("");
    }

    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setClientFile(file);
    }
  };

  return (
    <Box className="Card-Continer">
      <Card className="Card">
        <ToastContainer />

        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {t("Create Category")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}
          </FormControl>
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
                type="file"
                id="clientFile"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {/* Label acts as clickable avatar */}
              <label htmlFor="clientFile" style={{ cursor: "pointer" }}>
                <Avatar
                  variant="square"
                  alt="Profile"
                  src={preview || "/public/Images/AddPic.webp"}
                  sx={{
                    width: "100%",
                    height: "100%",
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
            <FormLabel htmlFor="Name">{t("Name")}</FormLabel>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameMessage}
              helperText={nameMessage}
              id="Name"
              placeholder={t("Name")}
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="Description">{t("Description")}</FormLabel>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!descriptionMessage}
              helperText={descriptionMessage}
              id="Description"
              placeholder={t("Description")}
              required
              fullWidth
            />
          </FormControl>

          <Button
            startIcon={<ArrowBack />}
            component={Link}
            to={`/System/Categorys`}
            sx={{
              backgroundColor: "rgb(200, 122, 122)",
              boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
            }}
            fullWidth
            variant="contained"
          >
            {t("Back")}
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "rgb(56, 122, 122)",
              boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
            }}
            onClick={validateInputs}
          >
            {t("Save")}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CreateCategory;
