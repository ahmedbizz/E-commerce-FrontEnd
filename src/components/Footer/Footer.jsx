import React from "react";
import {
  Box,
  MenuItem,
  MenuList,
  IconButton,
  Typography,
} from "@mui/material";
import YouTube from "@mui/icons-material/YouTube";
import Facebook from "@mui/icons-material/Facebook";
import Twitter from "@mui/icons-material/Twitter";
import Instagram from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const info = [
    {
      name: t("GET HELP"),
      content: [
        { name: t("Shipping and Delivery") },
        { name: t("Returns") },
        { name: t("Payment Options") },
        { name: t("Contact Us") },
      ],
    },
    {
      name: t("ABOUT US"),
      content: [
        { name: t("Company Info") },
        { name: t("Careers") },
        { name: t("Sustainability") },
        { name: t("Press") },
      ],
    },
    {
      name: t("APPS"),
      content: [
        { name: t("Download App") },
        { name: t("iOS App") },
        { name: t("Android App") },
        { name: t("Help Center") },
      ],
    },
  ];

  return (
    <Box className="Footer">
      {/* Header Section */}
      <Box className="Head-Footer">
        {/* Left Section */}
        <Box className="Head-left">
          <MenuList>
            <MenuItem>{t("FIND A STORE")}</MenuItem>
            <MenuItem>{t("SIGN UP")}</MenuItem>
          </MenuList>
        </Box>

        {/* Center Section */}
        <Box className="Head-Main">
          {info.map((section, idx) => (
            <Box key={idx} className="Footer-section">
              <Typography variant="h6" className="Footer-title">
                {section.name}
              </Typography>
              {section.content.map((item, i) => (
                <Typography key={i} className="Footer-item">
                  {item.name}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>

        {/* Right Section - Social */}
        <Box className="Head-right">
          <IconButton>
            <Twitter />
          </IconButton>
          <IconButton>
            <Facebook />
          </IconButton>
          <IconButton>
            <YouTube />
          </IconButton>
          <IconButton>
            <Instagram />
          </IconButton>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box className="bottom-Footer">
        <Box className="bottom-left">
          <IconButton onClick={handleLanguageToggle}>
            <LanguageIcon />
          </IconButton>
          <Typography variant="body2">
            {i18n.language === "ar" ? "العربية" : "English"}
          </Typography>
        </Box>
        <Box className="bottom-right">
          <Typography variant="body2">{t("Terms of Use")}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
