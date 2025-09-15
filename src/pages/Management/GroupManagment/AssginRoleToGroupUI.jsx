import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { GetRoles } from "../../../services/RoleService";
import { AssginRoleToGroup ,GetRolesInGroupByID } from "../../../services/GroupService";
import { useState, useEffect } from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import { useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
const AssginRoleToGroupUI = () => {

  const { t } = useTranslation();
  const { id } = useParams();

  const [selectedroleNames, setSelectedroleNames] = useState([]);

  // دالة عند الضغط على Checkbox
  const handleSelect = (names) => {
    setSelectedroleNames(
      (prev) =>
        prev.includes(names)
          ? prev.filter((name) => name !== names) // إذا كان موجود نحذفه
          : [...prev, names] // إذا ما كان موجود نضيفه
    );
  };
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
  const [Filter, setFilter] = useState([]);
  useEffect(() => {
    GetRoles()
      .then((res) =>{ setRoles(res.data)
        setFilter(res.data)})
      .catch((err) => {
        notifyErorr(err)
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);


  const handleSubmit =async (event) => {
    event.preventDefault();
    const data ={roleNames:selectedroleNames}

    try {
      const res = await AssginRoleToGroup(id,data);
      console.log(res)
      if (res) {
        notify(res.data.message);
      } else {
        notifyErorr(res.message || "Users not assgin ");
      }
    } catch (err) {
      console.log(err)
      notifyErorr("Group assgin failed");
    }

  };
    // for get all Selected Roles in list



    useEffect(() => {
      GetRolesInGroupByID(id)
        .then((res) => setSelectedroleNames(res.data))
        .catch((err) => {
          if (err.response?.status === 404) {
            console.log("لا يوجد مستخدمين في هذه المجموعة.");
          } else {
            console.log("حدث خطأ أثناء جلب البيانات.");
          }
        })
        .finally(() => setLoading(false));
    }, []);

      // sraech

  // function for sreash on the site

  const handleSearch = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(Roles); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }

    const filtered = Roles.filter((us) =>
      us.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilter(filtered);
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
    <Box   className="Display-Item-Continer">
    
      <ToastContainer/>
      <Box className="Button_Search_Panel">

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

      <Table className="Table">
        <TableHead   className="TableHead">
          <TableRow>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("ID")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
            <TableCell align="left">{t("Create At")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{backgroundColor:"rgba(255, 255, 255, 0.966)"}} >
          {(Filter.length ? Filter : []).map((item, index) => {
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

                      <TableCell>
                  <Checkbox
                    checked={!!selectedroleNames.includes(item.name)} // id أو أي مفتاح المستخدم
                    onChange={() => handleSelect(item.name)}
                    color="primary"
                  />
                </TableCell>
            </TableRow>)
          })}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", gap: "5px" }}>
            <Button
              startIcon={<ArrowBack />}
              component={Link}
              to={`/System/groups`}
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
             onClick={handleSubmit}
              sx={{
                backgroundColor: "rgb(56, 122, 122)",
                boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
              }}
              fullWidth
              variant="contained"
            >
              {t("Assign Selected Roles")}
            </Button>
          </Box>
    </Box>
  );
};

export default AssginRoleToGroupUI;
