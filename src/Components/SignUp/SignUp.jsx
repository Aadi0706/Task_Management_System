import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import "./SignUp.css"

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:8080/users', { username, password, role: 'user' });
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Box className="SignUpBox">
      <Typography variant="h4" gutterBottom>Signup Page</Typography>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="username" />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}  className='password'/>
      <Button variant="contained" color="primary" onClick={handleSignup} className='btnSignUp' >Signup</Button>
      <Typography variant="body2" align="center">
        Already have an account? <Link href="/login">Login here</Link>
      </Typography>
    </Box>
  );
};

export default Signup;
