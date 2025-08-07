import { useState } from "react";
import { login } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
export default function Login() {
  const [formData, setFormData] = useState({ Email: '', Password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      if(res.token){
      loginUser(res.token); // نفترض أن الـ API يرجع { token: "..." }
      navigate("/");}else{
        setError(res.message ||"Email or password failed")
      }
    } catch (err) {
  
      setError("Email or password failed")
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          تسجيل الدخول
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="Email"
            autoComplete="email"
            autoFocus
            value={formData.Email}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="Password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={formData.Password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
             login
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                Do`t have account ? register now
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
