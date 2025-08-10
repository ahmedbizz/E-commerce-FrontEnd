import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { GetRoles ,DeleteRoleByID} from "../../../services/RoleService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { ToastContainer, toast } from "react-toastify";
const DispalyRole = () => {

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
  useEffect(() => {
    GetRoles()
      .then((res) => setRoles(res.data))
      .catch((err) => {
        notifyErorr(err)
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const Refresh =()=>{
    GetRoles()
    .then((res) => setRoles(res.data))
    .catch((err) => {
      notifyErorr(err.message);
      setError(true);
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
    <Box>
      <ToastContainer/>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("ID")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
            <TableCell align="left">{t("Create At")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(Roles || []).map((item, index) => {
          return(     
          <TableRow key={index} sx={{":hover":{
            backgroundColor: "rgb(141, 189, 189)" ,
            boxShadow:" 0px 6px 0px rgb(240, 240, 175, 1)"
          }}} >
           <TableCell>{item.name}</TableCell>
              <TableCell>{item.id}</TableCell>
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
