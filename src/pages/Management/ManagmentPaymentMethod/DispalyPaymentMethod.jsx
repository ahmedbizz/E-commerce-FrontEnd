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
import { GetPaymentMethods } from "../../../services/PaymentMethodService";
import { useState, useEffect } from "react";
import EditNote from "@mui/icons-material/EditNote";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Add from "@mui/icons-material/Add";

const DisplayPaymentMethod = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const notify = (value) =>
    toast.success(`${value}`, { position: "top-center", autoClose: 5000, theme: "light" });
  const notifyError = (value) =>
    toast.error(`${value}`, { position: "top-center", autoClose: 5000, theme: "light" });

  const [PaymentMethods, setPaymentMethods] = useState([]);
  const [Filter, setFilter] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPaymentMethods = async (page = 1) => {
    GetPaymentMethods(page)
      .then((res) => {
        setPaymentMethods(res.data);
        setFilter(res.data);
        if (!res.data || res.data.length === 0) setEmpty(true);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        notifyError("حدث خطأ أثناء جلب البيانات.");
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPaymentMethods(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    const query = e.target.value;
    if (!query) return setFilter(PaymentMethods);

    const filtered = PaymentMethods.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilter(filtered);
  };

  if (Loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={80} />
      </Box>
    );

  if (isEmpty)
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
        <Typography variant="h6" color="text.secondary">{t("There are no items added yet.")}</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/System/PaymentMethod/create")}>
          {t("new_item")}
        </Button>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <ToastContainer />
        <Typography variant="h5" color="error">Oops! Something went wrong.</Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>Retry</Button>
      </Box>
    );

  return (
    <Box className="Display-Item-Continer">
      <ToastContainer />
      <Box className="Button_Search_Panel">
        <Button startIcon={<Add />} component={Link} to="/System/PaymentMethod/create" variant="contained">
          {t("new")}
        </Button>
        <TextField
          placeholder="Type.."
          fullWidth
          onChange={handleSearch}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("IsActive")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Filter.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {item.isActive ? <Typography color="success">✔</Typography> : <Typography color="error">✖</Typography>}
              </TableCell>
              <TableCell>
                <IconButton component={Link} to={`/System/PaymentMethod/edit/${item.id}`} sx={{ color: "green" }}>
                  <EditNote />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
      </Box>
    </Box>
  );
};

export default DisplayPaymentMethod;
