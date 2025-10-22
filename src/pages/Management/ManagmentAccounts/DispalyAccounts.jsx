import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Button,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
  GetAccountss,
  GetjournalEntryDetails

} from "../../../services/AccountService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditNote from "@mui/icons-material/EditNote";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import Add from "@mui/icons-material/Add";
import { formatPrice } from "/src/utils/formatPrice";
import { cond } from "lodash";
import AttachMoney from '@mui/icons-material/AttachMoney';
import AccountBalance from '@mui/icons-material/AccountBalance';
const DispalyAccounts = () => {
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
  // for get all Accounts in list
  const [Accountss, setAccountss] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [Filter, setFilter] = useState([]);
  const fetchAccountss = async (page = 1) => {
    GetAccountss((page = 1))
      .then((res) => {
        console.log(res.data)
        setAccountss(res.data.items);
        setFilter(res.data.items);
        if (res.data?.length <= 0) {
          setEmpty(true);
        }
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
    

        console.log(error)
        if (error.response && error.response.data) {
          const { errors, message } = error.response.data;
      
          if (errors && typeof errors === "object") {
            // نستخرج كل رسائل الأخطاء من الـ object
            const allErrors = Object.values(errors).flat();
            notifyErorr(allErrors.join("\n"));
            return;
          }
      
          if (Array.isArray(message)) {
            setError(true);
            notifyErorr(message.join("\n"));
            return;
          }
      
          if (typeof message === "string") {
            notifyErorr(message);
            setError(true);
            return;
          }
        }
        notifyErorr(t("errorr_message"));
      
    
      
      

      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchAccountss(currentPage);
  }, [currentPage]);



  const fetchjournalEntryDetails = async (id,page = 1) => {
    GetjournalEntryDetails(id,(page = 1))
      .then((res) => {
        console.log(res.data)

        if (res.data?.length <= 0) {
          setEmpty(true);
        }
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
    
          console.log(error)
    
        if (error.response && error.response.data) {
          const { errors, message } = error.response.data;
      
          if (errors && typeof errors === "object") {
            // نستخرج كل رسائل الأخطاء من الـ object
            const allErrors = Object.values(errors).flat();
            notifyErorr(allErrors.join("\n"));
            return;
          }
      
          if (Array.isArray(message)) {
            setError(true);
            notifyErorr(message.join("\n"));
            return;
          }
      
          if (typeof message === "string") {
            notifyErorr(message);
            setError(true);
            return;
          }
        }
        notifyErorr(t("errorr_message"));
      
    
      
      

      })
      .finally(() => setLoading(false));
  };





  const handleAccountClick = (AccountId) => {
    const params = new URLSearchParams({ AccountId: AccountId });
    navigete(`/System/journalEntryDetails?${params.toString()}`);
  };

  // sraech

  // function for sreash on the site

  const handleSearch = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(Accountss); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }

    const filtered = Accountss.filter((Cat) =>
      Cat.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilter(filtered);
  };

  if (Loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          sx={{ animation: "rotate 1.5s linear infinite" }}
          size={80}
        />
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
        <InventoryOutlinedIcon sx={{ fontAccounts: 80, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          {t("There are no item added yet.")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("isEmpty_add")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigete("/System/Taxe/create")} // أو أي مسار إضافة المنتج
        >
          {t("new_item")}
        </Button>
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ToastContainer />
        <Typography variant="h5" color="error">
          Oops! Something went wrong. Please try again.
        </Typography>
        {/* Optionally, add a button to refresh or contact support */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }
  return (
    <Box className="Display-Item-Continer">
      <ToastContainer />
      <Box className="Button_Search_Panel">
        <Button
          startIcon={<Add />}
          component={Link}
          to={`/System/Taxe/create`}
          variant="contained"
          className="create-button"
        >
          {t("new")}
        </Button>
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
        <Typography sx={{
          display:"flex",
          alignItems:"center",
          width:"230px",
          color:"gray"
      
        }}>        
          <AccountBalance sx={{
          
          fontSize:"44px",
          color:"gray"
        }}/>
        
        {t("Finance Accounts")}
        </Typography>

      </Box>
      <Table className="Table">
        <TableHead className="TableHead">
          <TableRow>

            <TableCell>{t("Account")}</TableCell>
            <TableCell>{t("Code")}</TableCell>
            <TableCell>{t("balance")}</TableCell>
            <TableCell>{t("description")}</TableCell>
            <TableCell>{t("Type")}</TableCell>
            <TableCell>{t("isActive")}</TableCell>
    
            <TableCell>{t("lastUpdated")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(Filter?.length ? Filter : []).map((item, index) => {
            return (
              <TableRow key={index} className="TableRow">

                <TableCell>{item.name}</TableCell>
                <TableCell align="left">{item.code}</TableCell>
                <TableCell align="left">{item.balance > 0 ? <Typography color="success">{formatPrice(item.balance)}</Typography> : <Typography color="error">{formatPrice(item.balance)}</Typography>}</TableCell>
                <TableCell align="left">{item.description}</TableCell>
                <TableCell align="left">{item.type}</TableCell>
                <TableCell align="left">  {item.isActive ? <Typography color="success">✔</Typography> : <Typography color="error">✖</Typography>}</TableCell>
              
                <TableCell align="left">
                    {new Date(item.lastUpdated).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).replace(',', '')}
                  </TableCell>
                <TableCell align="left">
                  <IconButton
                    component={Link}
                    to={`/System/Taxe/edit/${item.id}`}
                    sx={{ color: "green" }}
                  >
                    <EditNote />
                  </IconButton>

                  <Button
                    sx={{ width:"90px" , color:"green" }}
                    onClick={() => {
                      handleAccountClick(item.id);
                    }}
                  >
                  <AttachMoney color="success" />journal
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          className="Pagination"
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
        />
      </Box>
    </Box>
  );
};

export default DispalyAccounts;
