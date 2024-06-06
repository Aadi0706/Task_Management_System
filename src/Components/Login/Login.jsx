import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import './Login.css';



const Login = ({ setAuthUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users?username=${username}&password=${password}`);
      if (response.data.length > 0) {
        const user = response.data[0];
        setAuthUser(user);
        navigate('/');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Login Page</Typography>
      <Box className="InputBox">
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="Input"   />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="password" />
      <Button variant="contained" color="primary" onClick={handleLogin} className="login">Login</Button>
      </Box>
      <Typography variant="body2" align="center">
        Don't have an account? <Link href="/signup">Sign up here</Link>
      </Typography>
    </Box>
  );
};

export default Login;
