import React, { use, useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AuthContext } from "../../context/AuthContext"; // تأكد من المسار الصحيح
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
// ==== تنسيقات مخصصة للبحث ====
const Search = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: "inherit",
  },

  width: "100%",
  maxWidth: 400,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
}));

export default function ManageDashboard() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { user, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElang, setAnchorElang] = useState(null);
  const [anchorElProducts, setAnchorElProducts] = useState(null);
  const [anchorElUsers, setAnchorElUsers] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  // to cahange langueg
  const options = ["AR", "ENG"];
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    Cookies.set("language", index, { expires: 7, secure: true });
    setAnchorEl(null);
    if (index === 0) {
      i18n.changeLanguage("ar");
    } else {
      i18n.changeLanguage("en");
    }
  };
  const open = Boolean(anchorElang);
  const handleClickListItem = (event) => {
    setAnchorElang(event.currentTarget);
  };
  const handleCloseElang = () => {
    setAnchorElang(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logoutUser();
    handleClose();
  };
  const handleOpenProducts = (event) => {
    setAnchorElProducts(event.currentTarget);
  };

  const handleCloseProducts = () => {
    setAnchorElProducts(null);
  };

  const handleOpenUsers = (event) => {
    setAnchorElUsers(event.currentTarget);
  };

  const handleCloseUsers = () => {
    setAnchorElUsers(null);
  };
  return (
    <div>
      {/* headar 1 section  */}
      <Box id="Box_header_1" sx={{}}>
        <List id="EN_AR_List" aria-label="Device settings">
          <ListItemButton
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClickListItem}
          >
            <ListItemText secondary={options[selectedIndex]} />
          </ListItemButton>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorElang}
          open={open}
          onClose={handleCloseElang}
          MenuListProps={{
            "aria-labelledby": "lock-button",
            role: "listbox",
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
              sx={{ fontSize: "10px" }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <AppBar className="AppBarHeader" position="static">
        <Toolbar>
          {/* الشعار */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "white", flexGrow: 1 }}
          >
            🛒 {t("Home")}
          </Typography>
          {/* إدارة المنتجات */}
          <Button color="inherit" onClick={handleOpenProducts}>
            {t("Manage Product")}
          </Button>
          <Menu
            anchorEl={anchorElProducts}
            open={Boolean(anchorElProducts)}
            onClose={handleCloseProducts}
          >
            <MenuItem
              component={Link}
              to="/product/create"
              onClick={handleCloseProducts}
            >
              {t("Create Product")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/products"
              onClick={handleCloseProducts}
            >
              {t("Display Products")}
            </MenuItem>
          </Menu>

          {/* إدارة المستخدمين */}
          <Button color="inherit" onClick={handleOpenUsers}>
            {t("Manage Users")}
          </Button>
          <Menu
            anchorEl={anchorElUsers}
            open={Boolean(anchorElUsers)}
            onClose={handleCloseUsers}
          >
            <MenuItem component={Link} to="/users" onClick={handleCloseUsers}>
              {t("Display Users")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/users/create"
              onClick={handleCloseUsers}
            >
              {t("Create User")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/role/create"
              onClick={handleCloseUsers}
            >
              {t("Create Role")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/role"
              onClick={handleCloseUsers}
            >
              {t("Display Role")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/groups"
              onClick={handleCloseUsers}
            >
              {t("Display Groups")}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/group/create"
              onClick={handleCloseUsers}
            >
              {t("Create Group")}
            </MenuItem>


          </Menu>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* صورة المستخدم وقائمة */}
            {user ? (
              <>
                <IconButton onClick={handleMenu} size="large" sx={{ p: 0 }}>
                  <Avatar
                    alt={user.name}
                    src={
                      user.image
                        ? `https://localhost:7137/images/Users/${user.image}`
                        : "/user-avatar.jpg"
                    }
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                  >
                    {t("Profile")}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}> {t("Logout")}</MenuItem>
                </Menu>
              </>
            ) : (
              <Link
                to="/login"
                style={{ color: "white", textDecoration: "none" }}
              >
                {t("Login")}
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
