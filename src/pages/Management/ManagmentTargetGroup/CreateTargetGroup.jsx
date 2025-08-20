import * as React from "react";
import { Alert, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AddTargetGroup } from "../../../services/TargetGroupService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import "../../../styles/global.css";

const CreateTargetGroup = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [nameMessage, setNameMessage] = useState("");


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



    try {
      const res = await AddTargetGroup(formData);
      if (res) {
        notify_Create(res.data.message);
        setName("");


      } else {
        setError(res.message || "Name or Type is invalid");
      }
    } catch (err) {
      console.log(err);
      setError("TargetGroup create failed");
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



    return isValid;
  };



  return (
    <Box className="Card-Continer">
      <Card className="Card">
        <ToastContainer />

        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontTargetGroup: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {t("Create TargetGroup")}
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


          <Button
            startIcon={<ArrowBack />}
            component={Link}
            to={`/TargetGroups`}
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

export default CreateTargetGroup;
