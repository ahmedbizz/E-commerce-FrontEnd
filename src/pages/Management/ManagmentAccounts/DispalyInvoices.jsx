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

  GetInvoices

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
const DispalyInvoices = () => {
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
  // for get all Invoices in list
  const [Invoicess, setInvoicess] = useState([]);
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


  
  const fetchInvoicess = async (page = 1,filtersArg = filters) => {
    setLoading(true);
  
      const params = { page };
      Object.entries(filtersArg).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params[key] = value;
        }
      });
      GetInvoices(params)
      .then((res) => {
      
        const newInvoices = res.data.items;
        if (page === 1) {
          setInvoicess(res.data.items);
          setFilter(res.data.items);
        } else {
          setInvoicess(res.data.items);
          setFilter(res.data.items);
          setInvoicess((prev) => [...prev, ...newInvoices]);
          setFilter((prev) => [...prev, ...newInvoices]);
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
            fetchInvoicess(currentPage, filters); // تحديث القائمة مباشرة
          });
    setFilters(initialFilters);
    fetchInvoicess(currentPage, initialFilters);
                // تنظيف الاتصال عند الخروج
                return () => {
                  connection.stop();
                };
  }, [searchParams, currentPage]);


  // function for sreash on the site

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
  
    if (!query) {
      setFilter(Invoicess);
      return;
    }
  
    const filtered = Invoicess.filter((jo) =>
      (jo.referenceNumber ?? "").toLowerCase().includes(query) ||
      (jo.user?.fullName ?? "").toLowerCase().includes(query) ||
      (jo.fullName ?? "").toLowerCase().includes(query) ||
      (jo.user?.email ?? "").toLowerCase().includes(query)
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
        <InventoryOutlinedIcon sx={{ fontInvoices: 80, color: "text.secondary" }} />
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

            <TableCell>{t("Reference")}</TableCell>
            <TableCell>{t("Payment")}</TableCell>
            <TableCell>{t("Custmar")}</TableCell>
            <TableCell>{t("email")}</TableCell>
            <TableCell>{t("currency")}</TableCell>
            <TableCell>{t("subtotal")}</TableCell>
            <TableCell>{t("taxAmount")}</TableCell>
            <TableCell>{t("total")}</TableCell>
            <TableCell>{t("isPaid")}</TableCell>
            <TableCell>{t("type")}</TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {(Filter?.length ? Filter : []).map((item, index) => {
            return (
              <TableRow key={index} className="TableRow">

                <TableCell>{item.referenceNumber}</TableCell>
                <TableCell>{item.paymentMethod}</TableCell>
                <TableCell>{item.user.fullName}</TableCell>
                <TableCell>{item.user.email}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell align="left">{item.subtotal> 0 ? <Typography color="success">{formatPrice(item.subtotal)}</Typography> : <Typography color="error">{formatPrice(item.subtotal)}</Typography>}</TableCell>
                <TableCell align="left"><Typography color="error">+{formatPrice(item.taxAmount)}</Typography></TableCell>
                <TableCell align="left">{item.total > 0 ? <Typography color="success">{formatPrice(item.total)}</Typography> : <Typography color="error">{formatPrice(item.total)}</Typography>}</TableCell>

                <TableCell align="left">  {item.isPaid ? <Typography color="success">✔</Typography> : <Typography color="error">✖</Typography>}</TableCell>
              

              
                <TableCell>{item.type}</TableCell>

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

export default DispalyInvoices;
