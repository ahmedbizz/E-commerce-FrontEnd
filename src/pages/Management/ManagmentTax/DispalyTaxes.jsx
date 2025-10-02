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
  GetTaxCategorys,
  DeleteTaxCategoryByID,
} from "../../../services/TaxesService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditNote from "@mui/icons-material/EditNote";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import Add from "@mui/icons-material/Add";

const DispalyTaxCategory = () => {
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
  // for get all TaxCategory in list
  const [TaxCategorys, setTaxCategorys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [Filter, setFilter] = useState([]);
  const fetchTaxCategorys = async (page = 1) => {
    GetTaxCategorys((page = 1))
      .then((res) => {
        setTaxCategorys(res.data);
        setFilter(res.data);
        if (res.data?.length <= 0) {
          setEmpty(true);
        }
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
    

    
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
    fetchTaxCategorys(currentPage);
  }, [currentPage]);



  // for delete TaxCategory
  const deleteByID = async (id) => {
    try {
      const res = await DeleteTaxCategoryByID(id);
      notify(res.data.message);
      const updatedList = TaxCategorys.filter((g) => g.id !== id);
      setTaxCategorys(updatedList);
      setFilter(updatedList);
      if (updatedList.length === 0) {
        setEmpty(true);
      }
    } catch (err) {
  
      notifyErorr(err.message);
    }
  };

  // sraech

  // function for sreash on the site

  const handleSearch = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(TaxCategorys); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }

    const filtered = TaxCategorys.filter((Cat) =>
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
        <InventoryOutlinedIcon sx={{ fontTaxCategory: 80, color: "text.secondary" }} />
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
      </Box>
      <Table className="Table">
        <TableHead className="TableHead">
          <TableRow>

            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("Type")}</TableCell>
    
            <TableCell>{t("Action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(Filter?.length ? Filter : []).map((item, index) => {
            return (
              <TableRow key={index} className="TableRow">

                <TableCell>{item.name}</TableCell>
                <TableCell align="left">{item.rate}</TableCell>
          
                <TableCell align="left">
                  <IconButton
                    component={Link}
                    to={`/System/Taxe/edit/${item.id}`}
                    sx={{ color: "green" }}
                  >
                    <EditNote />
                  </IconButton>

                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => {
                      deleteByID(item.id);
                    }}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
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

export default DispalyTaxCategory;
