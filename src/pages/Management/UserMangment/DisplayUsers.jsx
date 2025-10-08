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
  Typography,Button,Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Link ,useNavigate} from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
  GetUsers,
  DeleteUserByID,
  
} from "../../../services/UsersService";
import { useState, useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditNote from "@mui/icons-material/EditNote";
import { ToastContainer, toast } from "react-toastify";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
const DisplayUsers = () => {
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
  const [Users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEmpty , setEmpty]=useState(false)
  const [Filter, setFilter] = useState([]);
  const fetchUsers = async (page = 1) => {
    GetUsers(page =1)
      .then((res) => {setUsers(res.data.items)
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
    fetchUsers(currentPage);
  }, [currentPage]);

  const Refresh = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await GetUsers(page);
      if (!res.data.items || res.data.items.length === 0) {
        // إذا الصفحة أصبحت فارغة بعد الحذف
        const newPage = page > 1 ? page - 1 : 1;
        if (newPage !== page) {
          setCurrentPage(newPage);
          return Refresh(newPage); // إعادة المحاولة بالصفحة الجديدة
        } else {
          setUsers([]);
          setEmpty(true);
        }
      } else {
        setUsers(res.data.items);
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
      const res = await DeleteUserByID(id);
      notify(res.data.message);
      const updatedList = Users.filter((g) => g.id !== id);
      setCategorys(updatedList);
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
      setFilter(Users); // إذا خانة البحث فارغة، نعرض كل العناصر
      return;
    }

    const filtered = Users.filter((us) =>
      us.fullName.toLowerCase().includes(query.toLowerCase())||
      us.email.toLowerCase().includes(query.toLowerCase())||
      us.phoneNumber.toLowerCase().includes(query.toLowerCase())
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
          onClick={() => navigete("/users/create")} // أو أي مسار إضافة المنتج
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
    <Box
    className="Display-Item-Continer"
    >
      <ToastContainer />
      <Box className="Button_Search_Panel">
        <Button
          startIcon={<Add />}
          component={Link}
          to={`/System/users/create`}
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
      <Table  className="Table">
        <TableHead className="TableHead"

        >
          <TableRow >
            <TableCell>{t("Image")}</TableCell>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("email")}</TableCell>
            <TableCell>{t("emailConfirmed")}</TableCell>
            <TableCell>{t("birthDay")}</TableCell>
            <TableCell>{t("phone")}</TableCell>
            <TableCell align="left">{t("Create At")}</TableCell>
            <TableCell>{t("Action")}</TableCell>

          </TableRow>
        </TableHead>
        <TableBody sx={{backgroundColor:"rgba(255, 255, 255, 0.966)"}}>
          {(Filter?.length ? Filter : []).map((item, index) => {
            return (
              <TableRow
                key={index}
                className="TableRow"
              >
                <TableCell>
                  {" "}
                  <Avatar
                    alt={item.fullName}
                    src={
                      item.imagePath
                        ? `${import.meta.env.VITE_BASE_URL}/images/Users/${item.imagePath}`
                        : "/user-avatar.jpg"
                    }
                  />
                </TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell align="left">{item.email}</TableCell>
                <TableCell align="left">{item.emailConfirmed}</TableCell>
                <TableCell align="left">{item.birthDay}</TableCell>
                <TableCell align="left">{item.phoneNumber}</TableCell>
                <TableCell align="left">{item.createAt}</TableCell>
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
                    to={`/System/user/edit/${item.id}`}
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
          
        />
      </Box>
    </Box>
  );
};

export default DisplayUsers;
