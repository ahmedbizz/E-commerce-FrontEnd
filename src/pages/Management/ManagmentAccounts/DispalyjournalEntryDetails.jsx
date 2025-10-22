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

  GetjournalEntryDetails

} from "../../../services/AccountService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditNote from "@mui/icons-material/EditNote";
import { Link, useNavigate ,useSearchParams} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';


import { formatPrice } from "/src/utils/formatPrice";
import { cond } from "lodash";
import * as signalR from "@microsoft/signalr";
const DispalyjournalEntryDetails = () => {
  const navigete = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
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
  // for get all journalEntryDetails in list
  const [journalEntryDetailss, setjournalEntryDetailss] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [Filter, setFilter] = useState([]);
  const [filters, setFilters] = useState({
  
    AccountId: null,
    minPrice: null,
    maxPrice: null,
  });


  
  const fetchjournalEntryDetailss = async (page = 1,filtersArg = filters) => {
    setLoading(true);
  
      const params = { page };
      Object.entries(filtersArg).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params[key] = value;
        }
      });
      GetjournalEntryDetails(params)
      .then((res) => {
        console.log(res.data)
        const newJournalEntryDetails = res.data.items;
        if (page === 1) {
          setjournalEntryDetailss(res.data.items);
          setFilter(res.data.items);
        } else {
          setjournalEntryDetailss(res.data.items);
          setFilter(res.data.items);
          setjournalEntryDetailss((prev) => [...prev, ...newJournalEntryDetails]);
          setFilter((prev) => [...prev, ...newJournalEntryDetails]);
        }

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
    const initialFilters = {
      AccountId: searchParams.get("AccountId") ? Number(searchParams.get("AccountId")) : null,
    };
            // الاتصال بالـ Hub
            const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_BASE_URL}/OrderHub`) // 👈 نفس المسار في السيرفر
            .withAutomaticReconnect()
            .build();
      
          // بدء الاتصال
          connection.start()
            .then(() => console.log("✅ Connected to SignalR OrderHub"))
            .catch(err => console.error("❌ SignalR error:", err));
      
          // عند استقبال التحديث من السيرفر
          connection.on("JournalCreated", () => {
            fetchjournalEntryDetailss(currentPage, filters); // تحديث القائمة مباشرة
          });
    setFilters(initialFilters);
    fetchjournalEntryDetailss(currentPage, initialFilters);
                // تنظيف الاتصال عند الخروج
                return () => {
                  connection.stop();
                };
  }, [searchParams, currentPage]);









  // function for sreash on the site

  const handleSearch = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(journalEntryDetailss); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }

    const filtered = journalEntryDetailss.filter((jo) =>
      jo.accountName.toLowerCase().includes(query.toLowerCase())
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
        <InventoryOutlinedIcon sx={{ fontjournalEntryDetails: 80, color: "text.secondary" }} />
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
        <TableHead className="TableHead">
          <TableRow>

            <TableCell>{t("accountName")}</TableCell>
            <TableCell>{t("credit")}</TableCell>
            <TableCell>{t("debit")}</TableCell>
            <TableCell>{t("description")}</TableCell>
            <TableCell>{t("reference")}</TableCell>
            <TableCell>{t("type")}</TableCell>
            <TableCell>{t("totalAmount")}</TableCell>
            <TableCell>{t("entryDate")}</TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {(Filter?.length ? Filter : []).map((item, index) => {
            return (
              <TableRow key={index} className="TableRow">

                <TableCell>{item.accountName}</TableCell>
                <TableCell align="left">{item.credit> 0 ? <Typography color="success">{formatPrice(item.credit)}</Typography> : <Typography color="error">{formatPrice(item.credit)}</Typography>}</TableCell>
                <TableCell align="left">{item.debit > 0 ? <Typography color="success">{formatPrice(item.debit)}</Typography> : <Typography color="error">{formatPrice(item.debit)}</Typography>}</TableCell>
                <TableCell align="left">{item.description}</TableCell>
                <TableCell align="left">{item.reference}</TableCell>
                <TableCell>
                  {item.type === "Debit" ? 
                  <Typography sx={{display:"flex" , alignItems:"center"}} ><TrendingUpIcon color="success" />{item.type}</Typography>                
                   : 
                   <Typography sx={{display:"flex" , alignItems:"center"}}>{item.type}<TrendingDownIcon color="error" /></Typography>
                    
                  }
                </TableCell>
                <TableCell align="left">  {item.type == "Debit" ? <Typography color="success">+{formatPrice(item.totalAmount)}</Typography> : <Typography color="error">-{formatPrice(item.totalAmount)}</Typography>}</TableCell>

              
                <TableCell align="left">
                    {new Date(item.entryDate).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).replace(',', '')}
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

export default DispalyjournalEntryDetails;
