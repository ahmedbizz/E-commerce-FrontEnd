import * as React from 'react';
import {Alert,CircularProgress} from '@mui/material'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { AddWareHouse } from "../../../services/WareHouseService";
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
const CreateWareHouse = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [Name, setName] = React.useState(false);
  const [NameMessage, setNameMessage] = React.useState('');
  const [Location, setLocation] = React.useState(false);
  const [LocationMessage, setLocationMessage] = React.useState('');
  const [Capacity, setCapacity] = React.useState(false);
  const [CapacityMessage, setCapacityMessage] = React.useState('');
  const [loading, setLoading] = useState(false);

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
    const Location = document.getElementById('Location').value;
    const Capacity = document.getElementById('Capacity').value;
    event.preventDefault();
    if (!Name || Name.trim() === "") {
      setError("Name cannot be empty");
      return;
    }
    const data = {Name,Location,Capacity};  
    try {
      setLoading(true);
        const res = await AddWareHouse(data);
        if(res){
          notify_Create(res.data.message)
          event.target.reset();
        }
        else{
          setError(res.message ||"Name or Location is unValid")
        }
      } catch (err) {
    
        setError("WareHouse create is failed")
      }finally {
        setLoading(false);
      }
  };

  const validateInputs = () => {
    const Name = document.getElementById('Name');
    const Location = document.getElementById('Location');
    const Capacity = document.getElementById('Capacity');
    let isValid = true;

    if (!Name.value || !/^[a-zA-Z0-9\s]{3,}$/.test(Name.value)) {
      setName(true);
      setNameMessage('Please enter a valid Name .');
      isValid = false;
    } else {
      setName(false);
      setNameMessage('');
    }
    if (!Name.value || !/^[a-zA-Z0-9]{3,}$/.test(Location.value)) {
      setLocation(true);
      setLocationMessage('Please enter a valid Location.');
      isValid = false;
    } else {
      setLocation(false);
      setLocationMessage('');
    }
    if (!Capacity.value || !/^[0-9]{1,10}$/.test(Capacity.value)) {
      setCapacity(true);
      setCapacityMessage('Please enter a valid Capacity.');
      isValid = false;
    } else {
      setCapacity(false);
      setCapacityMessage('');
    }


    return isValid;
      
  };


  return (
<Box className="WareHouseCreatePageContiner" sx={{display:"flex", justifyContent:"center"}} >
      <Card variant="outlined">
        <ToastContainer/>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
      
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          {t("Create WareHouse")}
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
          <FormControl>
            <FormLabel htmlFor="Location">{t("Location")}</FormLabel>
            <TextField
              error={Location}
              helperText={LocationMessage}
              id="Location"
              type="Location"
              name="Location"
              placeholder={t("Location")}
              autoComplete="Location"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={Location ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="Capacity">{t("Capacity")}</FormLabel>
            <TextField
              error={Capacity}
              helperText={CapacityMessage}
              id="Capacity"
              type="Capacity"
              name="Capacity"
              placeholder={t("Capacity")}
              autoComplete="Capacity"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={Capacity ? 'error' : 'primary'}
            />
          </FormControl>
  
  
          
          <Button type="submit"  disabled={loading} fullWidth variant="contained" sx={{backgroundColor:"rgb(56, 122, 122)",boxShadow:"0px 6px 0px rgb(240, 240, 175, 1)"}} onClick={validateInputs}>
          {loading ? <CircularProgress size={24} /> : t("Save")}
          </Button>
  
        </Box>
      
  
      </Card>
</Box>
  );
}

export default CreateWareHouse;
