import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import TaskList from './Components/TaskForm/TaskList';
import TaskForm from './Components/TaskForm/TaskForm';
import TaskDetails from './Components/TaskForm/TaskDetails';
import Login from './Components/Login/Login';
import Signup from './Components/SignUp/SignUp';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

const App = () => {
  const [authUser, setAuthUser] = useState(null);

  const handleLogout = () => {
    setAuthUser(null);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          {authUser ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" href="/login">
                Login
              </Button>
              <Button color="inherit" href="/signup">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute authUser={authUser} />}>
          <Route index element={<TaskList authUser={authUser} />} />
          <Route path="task/new" element={<TaskForm authUser={authUser} />} />
          <Route path="task/:id" element={<TaskDetails authUser={authUser} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;



          // <Route path="/" element={<TaskForm/>} />
          // <Route path="/task-list" element={<TaskList/>} />
          // <Route path="/task/:id" element={<TaskDetails/>} />
