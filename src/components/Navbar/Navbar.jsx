import React, { use, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';

import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AuthContext } from '../../context/AuthContext'; // تأكد من المسار الصحيح

// ==== تنسيقات مخصصة للبحث ====
const Search = styled('div')(({ theme }) => ({

  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: "inherit",
  },

  width: '100%',
  maxWidth: 400,
}));



const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',

}));

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);


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
  console.log(user)
  return (
    <AppBar position="static" sx={{ backgroundColor:'teal' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* الشعار */}
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
          🛒 Cart
        </Typography>
        <Link to={"/product/create"}>Create product</Link>
        {/* البحث */}
        <Search>
          <StyledInputBase placeholder="Search"inputProps={{ 'aria-label': 'search' }} />
        </Search>
        

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>


          {/* صورة المستخدم وقائمة */}
          {user ? (
            <>
        {/* أيقونة السلة */}
          <IconButton component={Link} to="/cart" size="large" color="inherit">
            <Badge badgeContent={2} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
              <IconButton onClick={handleMenu} size="large" sx={{ p: 0 }}>
                <Avatar alt={user.name} src={user.image?`https://localhost:7137/images/Users/${user.image}`:"/user-avatar.jpg"} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                   Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}> Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login 
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
