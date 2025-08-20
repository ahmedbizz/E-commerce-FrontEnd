import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AuthContext } from "../../context/AuthContext"; // تأكد من المسار الصحيح
import { useTranslation } from "react-i18next";
import { GetTargetGroups } from "../../services/TargetGroupService";
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

export default function Navbar() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { user, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElang, setAnchorElang] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [TargetGroupRes, setTargetGroup] = useState([]);

  //  for loadeing Tagrget Group List
  useEffect(() => {
    async function fetchData() {
      try {
        const TargetGroup = await GetTargetGroups();
        setTargetGroup(TargetGroup.data);
      } catch {
        setTargetGroup([]);
      }
    }
    fetchData();
  }, []);

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

  const [anchorElMNI, setAnchorElMNI] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);

  const handleOpenMNI = (event, group) => {
    setAnchorElMNI(event.currentTarget);
    setHoveredGroup(group);
  };

  const handleCloseMNI = () => {
    setAnchorElMNI(null);
    setHoveredGroup(null);
  };

  return (
    <Box>
      {/* headar 1 section  */}
      <Box id="Box_header_1" sx={{ height: "65px" }}></Box>
      <AppBar className="AppBarHeader" position="fixed">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* الشعار */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <List id="EN_AR_List" aria-label="Device settings">
              <ListItemButton
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  borderRadius:"10px"
                }}
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
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: "white" }}
            >
              {t("Home")}
            </Typography>

            {/* البحث */}
            <TextField
              variant="outlined"
              placeholder={"Type.."}
              onChange={(e) => handleSearch(e)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
                className: "search-input",
              }}
            />
          </Box>
          <Box>
            <Box>
              {(TargetGroupRes || []).map((group, index) => (
                <Box
                  key={index}
                  onMouseEnter={(e) => handleOpenMNI(e, group)}
                  onMouseLeave={handleCloseMNI}
                  sx={{ display: "inline-block", mx: 1 }}
                >
                  <Button
                    color="inherit"
                    sx={{
                      height: "60px",
                    }}
                  >
                    {t(group.name)}
                  </Button>

                  <Popper
                    open={Boolean(anchorElMNI) && hoveredGroup === group}
                    anchorEl={anchorElMNI}
                    placement="bottom-start"
                    style={{ width: "100%" }}
                  >
                    <ClickAwayListener onClickAway={handleCloseMNI}>
                      <Paper elevation={3}>
                        <MenuList>
                          <MenuItem>{t("options")}</MenuItem>
                        </MenuList>
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* صورة المستخدم وقائمة */}
            {user ? (
              <>
                {/* أيقونة السلة */}
                <IconButton
                  component={Link}
                  to="/cart"
                  size="large"
                  color="inherit"
                >
                  <Badge badgeContent={2} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
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
    </Box>
  );
}
