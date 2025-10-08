import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Pagination,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { GetOrder, UpdateOrderById } from "../../../services/OrederService";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { formatPrice } from "/src/utils/formatPrice";
import SearchIcon from "@mui/icons-material/Search";
import { Chip } from "@mui/material";
import Check from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";

const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DisplayOrders = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [Orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [isAccess, setAccess] = useState(false);
  const [Filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    searchTerm: "",
    brandId: null,
    groupId: null,
    categoryId: null,
    minPrice: null,
    maxPrice: null,
  });
  const [open, setOpen] = useState(false);
  const [openNotifcation, setOpenNotifcation] = useState(false);
  const [openErorrNotifcation, setOpenErorrNotifcation] = useState(false);
  const [success, setsuccess] = useState("");

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page: Number(page) };
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          params[key] = value;
        }
      });

      const res = await GetOrder(params);
      console.log(res.data);
      setOrders(res.data.items);
      setFilter(res.data.items);

      if (res.data?.items.length <= 0) {
        setEmpty(true);
      } else {
        setEmpty(false);
      }

      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 404) {
        setEmpty(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (order, status) => {
    try {
      var res = await UpdateOrderById(order.id, status);
      console.error(res);
      setOpenNotifcation(true);
      setsuccess(t("order_status_updated", { status }));
      fetchOrders(currentPage);
    } catch (err) {
      console.error(err);
      notifyErorr(t("cannot_update_order"));
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const deleteByID = async (id) => {
    try {
      const res = await DeleteOrderByID(id);
      notify(res.data.message);
      const updatedList = Orders.filter((g) => g.id !== id);
      setOrders(updatedList);
      setFilter(updatedList);
      if (updatedList.length === 0) {
        setEmpty(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        notifyErorr(t("access_denied_401"));
      }
      if (err.response?.status === 404) {
        notifyErorr(t("no_items_on_page"));
      } else {
        notifyErorr(t("fetch_data_error"));
      }
      notifyErorr(err.message);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(Orders);
      return;
    }

    const filtered = Orders.filter(
      (us) =>
        us.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        us.userName.toLowerCase().includes(query.toLowerCase()) ||
        us.email.toLowerCase().includes(query.toLowerCase()) ||
        us.createdAt.toLowerCase().includes(query.toLowerCase())
    );
    setFilter(filtered);
  };

  const [items, setitems] = useState([]);
  const handleOpen = (values) => {
    setOpen(true);
    setitems(values);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Chip label={t("pending")} color="warning" sx={{ width: "110px" }} />
        );
      case "Processing":
        return (
          <Chip label={t("processing")} color="info" sx={{ width: "110px" }} />
        );
      case "Shipped":
        return (
          <Chip label={t("shipped")} color="primary" sx={{ width: "110px" }} />
        );
      case "Delivered":
        return (
          <Chip
            label={t("delivered")}
            color="success"
            icon={<Check />}
            sx={{ width: "110px" }}
          />
        );
      case "Cancelled":
        return (
          <Chip label={t("cancelled")} color="error" sx={{ width: "110px" }} />
        );
      default:
        return <Chip label={status} variant="outlined" />;
    }
  };

  const statusButtonsMap = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
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

  if (isAccess) {
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
        <AccessAlarm sx={{ fontSize: 80, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          {t("access_denied")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("access_logout")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/logout")}
        >
          {t("new_item")}
        </Button>
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
          {t("no_items_added")}
        </Typography>
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
        <Typography variant="h5" color="error">
          {t("something_went_wrong")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          {t("retry")}
        </Button>
      </Box>
    );
  }
  return (
    <Box className="Display-Item-Continer">
      <ToastContainer />
      <Snackbar
        open={openNotifcation}
        autoHideDuration={1000}
        onClose={() => setOpenNotifcation(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <CustomAlert severity="success">{success}</CustomAlert>
      </Snackbar>

      <Snackbar
        open={openErorrNotifcation}
        autoHideDuration={1000}
        onClose={() => setOpenErorrNotifcation(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <CustomAlert severity="error">{"Error"}</CustomAlert>
      </Snackbar>

      <Dialog
        className="Card-Continer-Dialog-Orders"
        open={open}
        onClose={handleClose}
      >
        <Table className="Table">
          <TableHead className="TableHead">
            <TableRow>
              <TableCell>{t("productImage")}</TableCell>
              <TableCell>{t("productName")}</TableCell>
              <TableCell>{t("quantity")}</TableCell>
              <TableCell>{t("Size")}</TableCell>
              <TableCell>{t("unitPrice")}</TableCell>
              <TableCell>{t("total")}</TableCell>
              <TableCell>{t("Tax")}</TableCell>
              <TableCell>{t("Amount")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(items.length ? items : []).map((item, index) => {
              return (
                <TableRow
                  key={index}
                  className="TableRow"
                  onClick={() => setOpen(true)}
                >
                  <TableCell>
                    {" "}
                    <Avatar
                      alt={item.name}
                      variant="square"
                      sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                      }}
                      src={
                        item.productImage
                          ? `${import.meta.env.VITE_BASE_URL}/images/Products/${item.productImage}`
                          : "/Product-avatar.jpg"
                      }
                    />
                  </TableCell>
                  <TableCell align="left">{item.productName}</TableCell>
                  <TableCell align="left">{item.quantity}</TableCell>
                  <TableCell align="left">{item.sizeName}</TableCell>
                  <TableCell align="left">
                    {formatPrice(item.unitPrice)}
                  </TableCell>
                  <TableCell align="left">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </TableCell>
                  <TableCell align="left">
                    <Typography color="error.main">
                      +{formatPrice(item.taxAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell color="success" align="left">
                    <Typography color="success.main">
                      {formatPrice(item.totalWithTax)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Dialog>

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
            <TableCell>{t("#")}</TableCell>
            <TableCell>{t("Items")}</TableCell>
            <TableCell>{t("orderNumber")}</TableCell>
            <TableCell>{t("createdAt")}</TableCell>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("email")}</TableCell>
            <TableCell>{t("status")}</TableCell>
            <TableCell>{t("Total")}</TableCell>
            <TableCell>{t("TAX")}</TableCell>
            <TableCell>{t("Amount")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(Filter.length ? Filter : []).map((item, index) => {
            return (
              <TableRow key={index} className="TableRow">
                <TableCell>{item.id}</TableCell>
                <TableCell align="center">
                  <AvatarGroup max={4} sx={{ justifyContent: "center" }}>
                    {item.orderItems.slice(0, 4).map((product, idx) => (
                      <Tooltip key={idx} title={product.name} arrow>
                        <Avatar
                          onClick={() => handleOpen(item.orderItems)}
                          alt={item.name}
                          variant="square"
                          sx={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "100px",
                          }}
                          src={
                            product.productImage
                              ? `${
                                  import.meta.env.VITE_BASE_URL
                                }/images/Products/${product.productImage}`
                              : "/Product-avatar.jpg"
                          }
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </TableCell>
                <TableCell align="left">{item.orderNumber}</TableCell>
                <TableCell align="left">{item.createdAt}</TableCell>
                <TableCell align="left">{item.userName}</TableCell>
                <TableCell align="left">{item.email}</TableCell>
                <TableCell align="left">{getStatusChip(item.status)}</TableCell>

                <TableCell align="left">{formatPrice(item.subTotal)}</TableCell>
                <TableCell align="left">
                  <Typography color="error.main">
                    +{formatPrice(item.totalTax)}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography color="success.main">
                    ={formatPrice(item.totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {statusButtonsMap[item.status]?.map((nextStatus) => (
                    <Button
                      key={nextStatus}
                      variant="contained"
                      color={
                        nextStatus === "Cancelled"
                          ? "error"
                          : nextStatus === "Delivered"
                          ? "success"
                          : "primary"
                      }
                      onClick={() => handleUpdateStatus(item, nextStatus)}
                      sx={{ mr: 1, width: "110px" }}
                    >
                      {nextStatus}
                    </Button>
                  ))}
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

export default DisplayOrders;
