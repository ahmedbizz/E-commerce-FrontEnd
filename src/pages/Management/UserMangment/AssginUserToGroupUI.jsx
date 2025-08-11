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
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { GetUsers } from "../../../services/UsersService";
import { AssginUserToGroup } from "../../../services/GroupService";
import { useState, useEffect } from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import { useParams } from "react-router-dom";
const AssginUserToGroupUI = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [selectedUsers, setSelectedUsers] = useState([]);

  // دالة عند الضغط على Checkbox
  const handleSelect = (userId) => {
    setSelectedUsers(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // إذا كان موجود نحذفه
          : [...prev, userId] // إذا ما كان موجود نضيفه
    );
  };

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
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    GetUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => {
        notifyErorr(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit =async (event) => {
    event.preventDefault();
    const data ={UserIds:selectedUsers}

    try {
      const res = await AssginUserToGroup(id,data);
      console.log(res)
      if (res) {
        notify(res.data.message);
      } else {
        notifyErorr(res.message || "Users not assgin ");
      }
    } catch (err) {
      console.log(err)
      notifyErorr("Group assgin failed");
    }

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
        <TableHead
          sx={{
            backgroundColor: "rgb(240, 240, 175, 1)",
            alignContent: "center",
          }}
        >
          <TableRow>
            <TableCell>{t("Image")}</TableCell>
            <TableCell>{t("Name")}</TableCell>
            <TableCell>{t("email")}</TableCell>
            <TableCell>{t("emailConfirmed")}</TableCell>
            <TableCell>{t("birthDay")}</TableCell>
            <TableCell>{t("phone")}</TableCell>
            <TableCell align="left">{t("Create At")}</TableCell>
            <TableCell>{t("Select")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: "rgba(255, 255, 255, 0.966)" }}>
          {(Users || []).map((item, index) => {
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
                    alt={item.fullName}
                    src={
                      item.imagePath
                        ? `https://localhost:7137/images/Users/${item.imagePath}`
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
                <TableCell>
                  <Checkbox
                    checked={!!selectedUsers.includes(item.id)} // id أو أي مفتاح المستخدم
                    onChange={() => handleSelect(item.id)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>


<Box sx={{ display: "flex", gap: "5px" }}>
            <Button
              startIcon={<ArrowBack />}
              component={Link}
              to={`/groups`}
              sx={{
                backgroundColor: "rgb(200, 122, 122)",
                boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
              }}
              fullWidth
              variant="contained"
            >
              {t("Back")}
            </Button>
            <Button
             onClick={handleSubmit}
              sx={{
                backgroundColor: "rgb(56, 122, 122)",
                boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
              }}
              fullWidth
              variant="contained"
            >
              {t("Assign Selected Users")}
            </Button>
          </Box>
    </Box>
  );
};

export default AssginUserToGroupUI;
