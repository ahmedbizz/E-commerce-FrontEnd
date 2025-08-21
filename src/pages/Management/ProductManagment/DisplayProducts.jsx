import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Avatar,
  Typography,Button,Pagination , TextField,
  InputAdornment,
} from "@mui/material";
import { Link ,useNavigate} from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
  GetProducts,
  DeleteProductByID,
  } from "../../../services/productService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditNote from "@mui/icons-material/EditNote";
import { ToastContainer, toast } from "react-toastify";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const DisplayProducts = () => {
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
  const [Products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty , setEmpty]=useState(false)
  const [isAccess , setAccess]=useState(false)
  const [Filter, setFilter] = useState([]);
  const fetchProducts = async (page = 1) => {
    GetProducts(page =1)
      .then((res) => {setProducts(res.data.items)
        setFilter(res.data.items)
        if(res.data?.items.length <=0){
          setEmpty(true);
        }
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);})
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

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);



  // for delete WareHouse
  const deleteByID = async (id) => {
    try {
      const res = await DeleteProductByID(id);
      notify(res.data.message);
          // تحديث القائمة بدون إعادة تحميل
          const updatedList = Products.filter((g) => g.id !== id);
          setProducts(updatedList);
          setFilter(updatedList);
          if (updatedList.length === 0) {
            setEmpty(true);
          }
    } catch (err) {
      if (err.response?.status === 401) {
        notifyErorr("Access denied 401 Unauthorized");
      }
      if (err.response?.status === 404) {
        notifyErorr("لا يوجد منتجات في هذه الصفحة.");
        
      } else {
        notifyErorr("حدث خطأ أثناء جلب البيانات.");
        setError(true);
      }
      notifyErorr(err.message);
    }
  };

      // sraech

  // function for sreash on the site

  const handleSearch = (event) => {
    const query = event.target.value;
    if (!query) {
      setFilter(Products); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }

    const filtered = Products.filter((us) =>
      us.name.toLowerCase().includes(query.toLowerCase())

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
          {t("Access Denied.")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("Access_logout")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigete("/logout")} // أو أي مسار إضافة المنتج
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
          {t("There are no item added yet.")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("isEmpty_add")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigete("/product/create")} // أو أي مسار إضافة المنتج
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
          to={`/product/create`}
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
          <TableRow className="TableRow">
            <TableCell>{t("Image")}</TableCell>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("price")}</TableCell>
            <TableCell>{t("costPrice")}</TableCell>
            <TableCell>{t("stockQuantity")}</TableCell>
            <TableCell>{t("categoryId")}</TableCell>
            <TableCell align="left">{t("isActive")}</TableCell>
            <TableCell>{t("Action")}</TableCell>

          </TableRow>
        </TableHead>
        <TableBody >
          {(Filter.length?Filter:[]).map((item, index) => {
            return (
              <TableRow
                key={index}
                sx={{
                  ":hover": {
                    backgroundColor: "rgb(141, 189, 189)",
                    boxShadow: " 0px 6px 0px rgb(240, 240, 175, 1)",
                  },
                }}
              >
                <TableCell>
                  {" "}
                  <Avatar
                    alt={item.name}
                    variant="square"
                    sx={{
                      width:"100px",
                      height:"100px",
                      borderRadius:"10px"
                    }}
                    src={
                      item.imageUrl
                        ? `https://localhost:7137/images/Products/${item.imageUrl}`
                        : "/Product-avatar.jpg"
                    }
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="left">{item.price}</TableCell>
                <TableCell align="left">{item.costPrice}</TableCell>
                <TableCell align="left">{item.stockQuantity}</TableCell>
                <TableCell align="left">{item.categoryId}</TableCell>
      
                <TableCell align="left">{item.isActive}</TableCell>
                <TableCell align="left">
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => {
                      deleteByID(item.id);
                    }}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/product/edit/${item.id}`}
                    sx={{ color: "green" }}

                  >
                    <EditNote />
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

export default DisplayProducts;
