import React from "react";
import { Box, Typography, Button } from "@mui/material";
import NotAccessible from "@mui/icons-material/DoNotDisturb";
import { useTranslation } from "react-i18next";
import {useNavigate} from "react-router-dom";
export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 2,
        textAlign: "center",
      }}
    >
      <Box className="Card">
        <Typography variant="h6" >
          <NotAccessible sx={{ fontSize: 80, color: "error.main" }} />
        </Typography>

        <Typography variant="h6" color="text.secondary">
          {t("Access Denied.")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")} // أو أي مسار إضافة المنتج
        >
          {t("Access_logout")}
        </Button>
      </Box>
    </Box>
  );
}
