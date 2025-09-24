import React, {  useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
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
import { Link ,useNavigate} from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Dashboard from "@mui/icons-material/Dashboard";
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
  const [anchorElFinance, setAnchorElFinance] = useState(null);
  const [anchorElWarehouses, setAnchorElWarehouses] = useState(null);
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
  const handleOpenFinance = (event) => {
    setAnchorElFinance(event.currentTarget);
  };

  const handleCloseFinance = () => {
    setAnchorElFinance(null);
  };
  const handleOpenProducts = (event) => {
    setAnchorElProducts(event.currentTarget);
  };

  const handleCloseProducts = () => {
    setAnchorElProducts(null);
  };
  const handleOpenWarehouses = (event) => {
    setAnchorElWarehouses(event.currentTarget);
  };

  const handleCloseWarehouses = () => {
    setAnchorElWarehouses(null);
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
      <Box id="Box_header_1">
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
      <AppBar className="AppBarDashBoard" position="static">
        <Toolbar sx={{ display: "flex", justifyContent:"space-between", alignItems: "center", gap: 2 }}>
          {/* الشعار */}
          <Button   startIcon={<Dashboard/>} variant="h6" component={Link} to="/System">
          
          </Button>
          
            <Box>
                                      {/* إدارة الحسابات  */}
                  <Button color="inherit" onClick={handleOpenFinance}>
                          {t("Finance Managmenet")}
                        </Button>
                        <Menu
                          anchorEl={anchorElFinance}
                          open={Boolean(anchorElFinance)}
                          onClose={handleCloseFinance}
                        >
                          <MenuItem
                            component={Link}
                            to="/System/PaymentMethods"
                            onClick={handleCloseFinance}
                          >
                            {t("Payment Methods")}
                          </MenuItem>



                        </Menu>
                        {/* إدارة المنتجات */}
                        <Button color="inherit" onClick={handleOpenProducts}>
                          {t("Products")}
                        </Button>
                        <Menu
                          anchorEl={anchorElProducts}
                          open={Boolean(anchorElProducts)}
                          onClose={handleCloseProducts}
                        >
                          <MenuItem
                            component={Link}
                            to="/System/products"
                            onClick={handleCloseProducts}
                          >
                            {t("Display Products")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/product/create"
                            onClick={handleCloseProducts}
                          >
                            {t("Create Product")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/categorys"
                            onClick={handleCloseProducts}
                          >
                            {t("Display Category")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/categorys/create"
                            onClick={handleCloseProducts}
                          >
                            {t("Create Category")}
                          </MenuItem>

                          <MenuItem
                            component={Link}
                            to="/System/Brands"
                            onClick={handleCloseProducts}
                          >
                            {t("Display Brand")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/Brands/create"
                            onClick={handleCloseProducts}
                          >
                            {t("Create Brand")}
                          </MenuItem>

                          <MenuItem
                            component={Link}
                            to="/System/Sizes"
                            onClick={handleCloseProducts}
                          >
                            {t("Display Size")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/Size/create"
                            onClick={handleCloseProducts}
                          >
                            {t("Create Size")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/TargetGroups"
                            onClick={handleCloseProducts}
                          >
                            {t("Display TargetGroup")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/TargetGroup/create"
                            onClick={handleCloseProducts}
                          >
                            {t("Create TargetGroup")}
                          </MenuItem>
                        </Menu>
                        {/* ادارة المستودع والمخزون  */}
              
                        <Button color="inherit" onClick={handleOpenWarehouses}>
                          {t("Warehouses")}
                        </Button>
                        <Menu
                          anchorEl={anchorElWarehouses}
                          open={Boolean(anchorElWarehouses)}
                          onClose={handleCloseWarehouses}
                        >
                          <MenuItem
                            component={Link}
                            to="/System/wareHouses"
                            onClick={handleCloseWarehouses}
                          >
                            {t("Display WareHouse")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/wareHouse/create"
                            onClick={handleCloseWarehouses}
                          >
                            {t("Create WareHouse")}
                          </MenuItem>
              
                          <MenuItem
                            component={Link}
                            to="/System/inventorys"
                            onClick={handleCloseWarehouses}
                          >
                            {t("Display Inventory")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/inventory/create"
                            onClick={handleCloseWarehouses}
                          >
                            {t("Create Inventory")}
                          </MenuItem>
                        </Menu>
              
                        {/* إدارة المستخدمين */}
                        <Button color="inherit" onClick={handleOpenUsers}>
                          {t("Users")}
                        </Button>
                        <Menu
                          anchorEl={anchorElUsers}
                          open={Boolean(anchorElUsers)}
                          onClose={handleCloseUsers}
                        >
                          <MenuItem component={Link} to="/System/users" onClick={handleCloseUsers}>
                            {t("Display Users")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/users/create"
                            onClick={handleCloseUsers}
                          >
                            {t("Create User")}
                          </MenuItem>
                          <MenuItem component={Link} to="/System/role" onClick={handleCloseUsers}>
                            {t("Display Role")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/role/create"
                            onClick={handleCloseUsers}
                          >
                            {t("Create Role")}
                          </MenuItem>
              
                          <MenuItem component={Link} to="/System/groups" onClick={handleCloseUsers}>
                            {t("Display Groups")}
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to="/System/group/create"
                            onClick={handleCloseUsers}
                          >
                            {t("Create Group")}
                          </MenuItem>
                        </Menu>
              
            </Box>

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
                  <Link to="/login">{t("Login")}</Link>
                )}
              </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
