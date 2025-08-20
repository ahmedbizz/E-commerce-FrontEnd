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
  Pagination,  TextField,
  InputAdornment,
} from "@mui/material";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
  GetInventorys,
  DeleteInventoryByID,
} from "../../../services/InventoryService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditNote from "@mui/icons-material/EditNote";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const DispalyInventory = () => {
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
  // for get all Inventory in list
  const [Inventorys, setInventorys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [Filter, setFilter] = useState([]);

  const fetchInventorys = async (page = 1) => {
    GetInventorys(page)
      .then((res) => {
    
        setInventorys(res.data.items);
        setFilter(res.data.items);
    
        if (res.data?.items.length <= 0) {
          setEmpty(true);
        }
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      })

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
  };
  useEffect(() => {
    fetchInventorys(currentPage);
  }, [currentPage]);

  const Refresh = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await GetInventorys(page);
      if (!res.data.items || res.data.items.length === 0) {
        // إذا الصفحة أصبحت فارغة بعد الحذف
        const newPage = page > 1 ? page - 1 : 1;
        if (newPage !== page) {
          setCurrentPage(newPage);
          return Refresh(newPage); // إعادة المحاولة بالصفحة الجديدة
        } else {
          setInventorys([]);
          setEmpty(true);
        }
      } else {
        setInventorys(res.data.items);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setEmpty(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        notifyErorr("لا يوجد مستودعات في هذه الصفحة.");
        setEmpty(true);
      } else {
        notifyErorr("حدث خطأ أثناء جلب البيانات.");
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // for delete Inventory
  const deleteByID = async (id) => {
    try {
      const res = await DeleteInventoryByID(id);
      notify(res.data.message);
      Refresh(currentPage); // تحديث الصفحة بعد الحذف
    } catch (err) {
      notifyErorr(err.message);
    }
  };


    // sraech

  // function for sreash on the site

  const handleSearch = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(Inventorys); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }

    const filtered = Inventorys.filter((us) =>
      us.warehouseName.toLowerCase().includes(query.toLowerCase())||
        us.productName.toLowerCase().includes(query.toLowerCase())

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
          onClick={() => navigete("/Inventory/create")} // أو أي مسار إضافة المنتج
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
    <Box   className="Display-Item-Continer">
    
      <ToastContainer/>
      <Box className="Button_Search_Panel">
        <Button
          startIcon={<Add />}
          component={Link}
          to={`/inventory/create`}
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
        <TableHead   className="TableHead">
          <TableRow >
          
            <TableCell>{t("Products")}</TableCell>
            <TableCell>{t("Warehouses")}</TableCell>
            <TableCell>{t("Quantity")}</TableCell>

            <TableCell>{t("Action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: "rgba(255, 255, 255, 0.966)" }}>
          {(Filter.length?Filter:[]).map((item, index) => {
            return (
              <TableRow
              className="TableRow"
                key={index}

              >
          
              
                <TableCell align="left">{item.productName}</TableCell>
                <TableCell align="left">{item.warehouseName}</TableCell>
                <TableCell align="left">{item.quantity}</TableCell>
      
                <TableCell align="left">
                  <IconButton
                    component={Link}
                    to={`/Inventory/${item.id}`}
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
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DispalyInventory;
