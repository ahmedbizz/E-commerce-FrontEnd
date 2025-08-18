import * as React from "react";
import { Alert, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AddGroup } from "../../../services/GroupService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import "../../../styles/global.css";

const CreateGroup = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [Name, setName] = React.useState(false);
  const [NameMessage, setNameMessage] = React.useState("");
  const [Description, setDescription] = React.useState(false);
  const [DescriptionMessage, setDescriptionMessage] = React.useState("");

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
    const Name = document.getElementById("Name").value;
    const Description = document.getElementById("Description").value;
    event.preventDefault();
    if (!Name || Name.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    const data = { Name, Description };
    try {
      const res = await AddGroup(data);
      if (res) {
        notify_Create(res.data.message);
        event.target.reset();
      } else {
        setError(res.message || "Name or Description is unValid");
      }
    } catch (err) {
      setError("Group create is failed");
    }
  };

  const validateInputs = () => {
    const Name = document.getElementById("Name");
    let isValid = true;

    if (!Name.value || !/^[a-zA-Z0-9]{3,}$/.test(Name.value)) {
      setName(true);
      setNameMessage("Please enter a valid Name .");
      isValid = false;
    } else {
      setName(false);
      setNameMessage("");
    }
    if (!Name.value || !/^[a-zA-Z0-9]{3,}$/.test(Description.value)) {
      setDescription(true);
      setDescriptionMessage("Please enter a valid Description.");
      isValid = false;
    } else {
      setDescription(false);
      setDescriptionMessage("");
    }

    return isValid;
  };

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
          {t("Create Group")}
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
              id="Name"
              type="Name"
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
              error={Name}
              helperText={NameMessage}
              id="Description"
              type="Description"
              name="Description"
              placeholder={t("Description")}
              autoComplete="Description"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={Description ? "error" : "primary"}
            />
          </FormControl>

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
        </Box>
      </Card>
    </Box>
  );
};

export default CreateGroup;
