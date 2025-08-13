import * as React from "react";
import { Alert, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import {
  UpdateWareHouseById,
  GetWareHouseByID,
} from "../../../services/WareHouseService";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import "../../../styles/global.css";
import { useParams } from "react-router-dom";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));
const UpdateWareHouse = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [Loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: "",
    Location: "",
    Capacity:0
  });
  useEffect(() => {
    GetWareHouseByID(id)
      .then((res) =>
        setFormData({
          Name: res.data.name || "",
          Location: res.data.location || "",
          Capacity: res.data.capacity || "",
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
  const [Location, setLocation] = React.useState(false);
  const [LocationMessage, setLocationMessage] = React.useState("");
  const [Capacity, setCapacity] = React.useState(false);
  const [CapacityMessage, setCapacityMessage] = React.useState("");
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
      const res = await UpdateWareHouseById(formData, id);
      if (res) {
        notify_Update(res.data.message);
      } else {
        setError(res.message || "Name or Description is invalid");
      }
    } catch (err) {
      setError("WareHouse Update failed");
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!formData.Name || !/^[a-zA-Z0-9\s]{3,}$/.test(formData.Name)) {
      setName(true);
      setNameMessage("Please enter a valid Name.");
      isValid = false;
    } else {
      setName(false);
      setNameMessage("");
    }

    if (!formData.Location) {
      setLocation(true);
      setLocationMessage("Please enter a valid Location.!!");
      isValid = false;
    } else {
      setLocation(false);
      setLocationMessage("");
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
    <Box className="WareHouseUpdatePageContiner">
      <Card variant="outlined">
        <ToastContainer />
        <Box sx={{ display: { xs: "flex", md: "none" } }}></Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {t("Update WareHouse")}
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
            <FormLabel htmlFor="Location">{t("Location")}</FormLabel>
            <TextField
              error={Location}
              helperText={LocationMessage}
              value={formData.Location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  Location: e.target.value,
                }))
              }
              id="Location"
              name="Location"
              placeholder={t("Location")}
              autoComplete="Location"
              required
              fullWidth
              variant="outlined"
              color={Location ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="Capacity">{t("Capacity")}</FormLabel>
            <TextField
              error={Capacity}
              helperText={CapacityMessage}
              value={formData.Capacity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  Capacity: e.target.value,
                }))
              }
              id="Capacity"
              name="Capacity"
              placeholder={t("Capacity")}
              autoComplete="Capacity"
              required
              fullWidth
              variant="outlined"
              color={Capacity ? "error" : "primary"}
            />
          </FormControl>

          <Box sx={{ display: "flex", gap: "5px" }}>
            <Button
              startIcon={<ArrowBack />}
              component={Link}
              to={`/WareHouses`}
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

export default UpdateWareHouse;
