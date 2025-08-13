import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,Button
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { GetRoles ,DeleteRoleByID} from "../../../services/RoleService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
const DispalyRole = () => {
  const navigete = useNavigate();
  const { t } = useTranslation();
  const notify = (value) => {
    toast.success(`${value} `, {
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
  const notifyErorr = (value) => {
    toast.error(`${value} `, {
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
  // for get all Role in list
  const [Roles, setRoles] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty , setEmpty]=useState(false)
  useEffect(() => {
    GetRoles()
      .then((res) => setRoles(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          notifyErorr("لا يوجد مستخدمين في هذه المجموعة.");
          
          setEmpty(true);
      
        } else {
          notifyErorr("حدث خطأ أثناء جلب البيانات.");
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const Refresh =()=>{
    GetRoles()
    .then((res) => setRoles(res.data))
    .catch((err) => {
      if (err.response?.status === 404) {
        notifyErorr("لا يوجد مستخدمين في هذه المجموعة.");
        
        setEmpty(true);
    
      } else {
        notifyErorr("حدث خطأ أثناء جلب البيانات.");
        setError(true);
      }
    })
    .finally(() => setLoading(false));
  }

  // for delete Role 
    // this for delete Prodect
    const deleteByID = (id) => {
      DeleteRoleByID(id)
        .then((res) => {
          notify(res.data.message);
          Refresh();
        })
        .catch((err) => {
          notifyErorr(err.message);
        });
    };
if(Loading){
  return(
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" ,
    
        
      }}
    >
    <CircularProgress sx={{ animation: 'rotate 1.5s linear infinite' }} size={80} />
    </Box>
  );
}
if (isEmpty) {
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
      <InventoryOutlinedIcon sx={{ fontSize: 80, color: "text.secondary" }} />
      <Typography variant="h6" color="text.secondary">
        {t("There are no item added yet.")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("isEmpty_add")}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigete("/role/create")} // أو أي مسار إضافة المنتج
      >
        {t("new_item")}
      </Button>
    </Box>
  );
}
if (error) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h5" color="error">Oops! Something went wrong. Please try again.</Typography>
      {/* Optionally, add a button to refresh or contact support */}
      <Button variant="contained" color="primary" onClick={() => window.location.reload()}>Retry</Button>
    </Box>
  );
}
  return (
    <Box sx={{
        display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',

    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    }}>
      <ToastContainer/>
      <Table>
        <TableHead   sx={{backgroundColor: "rgb(240, 240, 175, 1)"}}>
          <TableRow>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("ID")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
            <TableCell align="left">{t("Create At")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{backgroundColor:"rgba(255, 255, 255, 0.966)"}} >
          {(Roles || []).map((item, index) => {
          return(     
          <TableRow key={index} sx={{":hover":{
            backgroundColor: "rgb(141, 189, 189)" ,
            boxShadow:" 0px 6px 0px rgb(240, 240, 175, 1)"
          }}} >
           <TableCell>{item.name}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell align="left" >
                        {item.name}
                      </TableCell>

                      <TableCell  align="left" >
                        <IconButton
                        sx={{color:"red"}}
                          onClick={() => {
                            deleteByID(item.id);
                          }}
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </TableCell>
            </TableRow>)
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DispalyRole;
