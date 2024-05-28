import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './Components/TaskForm/TaskList';
import TaskDetails from './Components/TaskForm/TaskDetails';
import { Container, Typography } from '@mui/material';
import TaskForm from './Components/TaskForm/TaskForm';

const App = () => {
  return (
    <Router>
      <Container>
        <Typography variant="h4" gutterBottom>
          Task Manager
        </Typography>
        <Routes>
          <Route path="/" element={<TaskForm/>} />
          <Route exact path="/task-list" element={<TaskList/>} />
          <Route path="/task/:id" element={<TaskDetails/>} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
