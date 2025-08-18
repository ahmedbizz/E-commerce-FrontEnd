import * as React from "react";
import { Alert, CircularProgress, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { UpdateGroupById, GetGroupByID } from "../../../services/GroupService";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import "../../../styles/global.css";
import { useParams } from "react-router-dom";

const UpdateGroup = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
  });
  useEffect(() => {
    GetGroupByID(id)
      .then((res) =>
        setFormData({
          Name: res.data.name || "",
          Description: res.data.description || "",
        })
      )
      .catch((err) => {
        notifyErorr(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const [error, setError] = useState("");
  const [Name, setName] = React.useState(false);
  const [NameMessage, setNameMessage] = React.useState("");
  const [Description, setDescription] = React.useState(false);
  const [DescriptionMessage, setDescriptionMessage] = React.useState("");

  const notify_Update = (info) => {
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

    try {
      const res = await UpdateGroupById(formData, id);
      if (res) {
        notify_Update(res.data.message);
      } else {
        setError(res.message || "Name or Description is invalid");
      }
    } catch (err) {
      setError("Group Update failed");
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!formData.Name || !/^[a-zA-Z0-9]{3,}$/.test(formData.Name)) {
      setName(true);
      setNameMessage("Please enter a valid Name.");
      isValid = false;
    } else {
      setName(false);
      setNameMessage("");
    }

    if (!formData.Description) {
      setDescription(true);
      setDescriptionMessage("Please enter a valid Description.!!");
      isValid = false;
    } else {
      setDescription(false);
      setDescriptionMessage("");
    }

    return isValid;
  };
  if (Loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          sx={{ animation: "rotate 1.5s linear infinite" }}
          size={80}
        />
      </Box>
    );
  }

  return (
    <Box className="Card-Continer">
      <Card className="Card" variant="outlined">
        <ToastContainer />
        <Box sx={{ display: { xs: "flex", md: "none" } }}></Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {t("Update Group")}
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
              error={Name}
              helperText={NameMessage}
              value={formData.Name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, Name: e.target.value }))
              }
              id="Name"
              name="Name"
              placeholder={t("Name")}
              autoComplete="Name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={Name ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="Description">{t("Description")}</FormLabel>
            <TextField
              error={Description}
              helperText={DescriptionMessage}
              value={formData.Description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  Description: e.target.value,
                }))
              }
              id="Description"
              name="Description"
              placeholder={t("Description")}
              autoComplete="Description"
              required
              fullWidth
              variant="outlined"
              color={Description ? "error" : "primary"}
            />
          </FormControl>

          <Box sx={{ display: "flex", gap: "5px" }}>
            <Button
              startIcon={<ArrowBack />}
              component={Link}
              to={`/groups`}
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
              sx={{
                backgroundColor: "rgb(56, 122, 122)",
                boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
              }}
              fullWidth
              variant="contained"
            >
              {t("Save")}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default UpdateGroup;
