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
  Pagination
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { GetGroups, DeleteGroupByID } from "../../../services/GroupService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Security from "@mui/icons-material/Security";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircle from "@mui/icons-material/SupervisedUserCircle";
import EditNote from "@mui/icons-material/EditNote";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const DispalyGroup = () => {
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
  // for get all Group in list
  const [Groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const fetchGroups = async (page = 1) => {
    GetGroups((page = 1))
      .then((res) => {
        setGroups(res.data.items);
        console.log(res.data)
        if(res.data?.items.length <=0){
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
    fetchGroups(currentPage);
  }, [currentPage]);

  const Refresh = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await GetGroups(page);
      if (!res.data.items || res.data.items.length === 0) {
        // إذا الصفحة أصبحت فارغة بعد الحذف
        const newPage = page > 1 ? page - 1 : 1;
        if (newPage !== page) {
          setCurrentPage(newPage);
          return Refresh(newPage); // إعادة المحاولة بالصفحة الجديدة
        } else {
          setGroups([]);
          setEmpty(true);
        }
      } else {
        setGroups(res.data.items);
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

  // for delete WareHouse
  const deleteByID = async (id) => {
    try {
      const res = await DeleteGroupByID(id);
      notify(res.data.message);
      Refresh(currentPage); // تحديث الصفحة بعد الحذف
    } catch (err) {
      notifyErorr(err.message);
    }
  };
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
          onClick={() => navigete("/categorys/create")} // أو أي مسار إضافة المنتج
        >
          {t("new_item")}
        </Button>
      </Box>
    );
  }
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        width: "100%",

        boxShadow:
          "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
      }}
    >
      <ToastContainer />
      <Table>
        <TableHead sx={{ backgroundColor: "rgb(240, 240, 175, 1)" }}>
          <TableRow>
            <TableCell>{t("ID")}</TableCell>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("Description")}</TableCell>
            <TableCell align="left">{t("Create At")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: "rgba(255, 255, 255, 0.966)" }}>
          {(Groups || []).map((item, index) => {
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
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="left">{item.description}</TableCell>
                <TableCell align="left">{item.createdAt}</TableCell>
                <TableCell align="left">
                  <IconButton
                    component={Link}
                    to={`/group/${item.id}`}
                    sx={{ color: "green" }}
                  >
                    <EditNote />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/assgin/users/${item.id}`}
                    sx={{ color: "balck" }}
                  >
                    <SupervisedUserCircle />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/assgin/roles/${item.id}`}
                    sx={{ color: "balck" }}
                  >
                    <Security />
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
           sx={{
            "& .MuiPaginationItem-root": {
              color: "rgb(56, 122, 122)", // لون النص
            },
            "& .Mui-selected": {
              backgroundColor: "rgb(56, 122, 122)", // خلفية الصفحة المختارة
              color: "#fff", // لون نص الصفحة المختارة
            },
          }}
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default DispalyGroup;
