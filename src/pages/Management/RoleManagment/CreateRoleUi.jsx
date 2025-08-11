import * as React from 'react';
import {Alert} from '@mui/material'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { CreateRole } from "../../../services/RoleService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "../../../styles/global.css"
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));
const CreateRoleUi = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [Name, setName] = React.useState(false);
  const [NameMessage, setNameMessage] = React.useState('');

  const notify_Create = (info) => {
    toast.success(` ${info} `, {
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
  const handleSubmit =async (event) => {
    const Name = document.getElementById('Name').value;
    event.preventDefault();
    if (!Name || Name.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    const data = {Name};  
    try {
        const res = await CreateRole(data);
        if(res){
          notify_Create(res.data.message)
          event.target.reset();
        }
        else{
          setError(res.message ||"Name is unValid")
        }
      } catch (err) {
    
        setError("Name is failed")
      }
  };

  const validateInputs = () => {
    const Name = document.getElementById('Name');
    let isValid = true;

    if (!Name.value || !/^[a-zA-Z0-9]{3,}$/.test(Name.value)) {
      setName(true);
      setNameMessage('Please enter a valid Name .');
      isValid = false;
    } else {
      setName(false);
      setNameMessage('');
    }


    return isValid;
      
  };


  return (
<Box className="RoleCreatePageContiner" >
      <Card variant="outlined">
        <ToastContainer/>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
      
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          {t("Create Role")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <FormControl>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="Name">{t("Name")}</FormLabel>
            <TextField
              error={Name}
              helperText={NameMessage}
              id="Name"
              type="Name"
              name="Name"
              placeholder={t("Name")}
              autoComplete="Name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={Name ? 'error' : 'primary'}
            />
          </FormControl>
  
  
          
          <Button type="submit" fullWidth variant="contained" sx={{backgroundColor:"rgb(56, 122, 122)",boxShadow:"0px 6px 0px rgb(240, 240, 175, 1)"}} onClick={validateInputs}>
          {t("Save")}
          </Button>
  
        </Box>
      
  
      </Card>
</Box>
  );
}

export default CreateRoleUi;
