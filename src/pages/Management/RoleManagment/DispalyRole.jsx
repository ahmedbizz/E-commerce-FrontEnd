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
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { GetRoles, DeleteRoleByID } from "../../../services/RoleService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const DispalyRole = () => {
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
  const [Roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [Filter, setFilter] = useState([]);

  useEffect(() => {
    Refresh();
  }, [currentPage]);

  const Refresh = (page = currentPage) => {
    GetRoles(page)
      .then((res) => {

        setRoles(res.data.items);
        setFilter(res.data.items);
        if (res.data?.items.length <= 0) {
          setEmpty(true);
        } else {
          setEmpty(false);
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

  // for delete Role
  // this for delete Prodect
  const deleteByID = (id) => {
    DeleteRoleByID(id)
      .then((res) => {
        notify(res.data.message);
        Refresh();
      })
      .catch((err) => {
        notifyErorr(err.message);
      });
  };

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
          onClick={() => navigete("/role/create")} // أو أي مسار إضافة المنتج
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
    <Box className="Display-Item-Continer">
      <ToastContainer />
      <Box className="Button_Search_Panel">
        <Button
          startIcon={<Add />}
          component={Link}
          to={`/System/role/create`}
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
            <TableCell>{t("#")}</TableCell>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("ID")}</TableCell>
            <TableCell>{t("Action")}</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: "rgba(255, 255, 255, 0.966)" }}>
          {(Filter.length ? Filter : []).map((item, index) => {
            return (
              <TableRow key={index} className="TableRow">
                <TableCell>{(currentPage - 1) * 20 + index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.id}</TableCell>
              

                <TableCell align="left">
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

export default DispalyRole;
