import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List, ListItem, ListItemText, Typography, Button, Box, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem,
  Select, FormControl, Tabs, Tab, AppBar
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const tasksPerPage = 5;

  const fetchTotalTasks = async (priority = 'All') => {
    let url = `http://localhost:8080/tasks`;
    if (priority !== 'All') {
      url += `?priority=${priority}`;
    }
    try {
      const response = await axios.get(url);
      const totalTasks = response.data.length;
      console.log(totalTasks,"totaltasksd....");
      setTotalPages(Math.ceil(totalTasks / tasksPerPage));
    } catch (error) {
      console.error('Error fetching total tasks:', error);
    }
  };

  const fetchTasks = async (page = 1, priority = 'All') => {
    let url = `http://localhost:8080/tasks?_page=${page}&_limit=${tasksPerPage}`;
    if (priority !== 'All') {
      url += `&priority=${priority}`;
    }
    try {
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTotalTasks(priorityFilter);
    fetchTasks(page, priorityFilter);
  }, [page, priorityFilter]);

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleClose = () => {
    setTaskToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await axios.delete(`http://localhost:8080/tasks/${taskToDelete.id}`);
      fetchTotalTasks(priorityFilter);
      fetchTasks(page, priorityFilter);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await axios.put(`http://localhost:8080/tasks/${task.id}`, { ...task, status });
      fetchTasks(page, priorityFilter);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityChange = (event, newValue) => {
    setPriorityFilter(newValue);
    setPage(1); // Reset to first page when changing priority filter
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Tasks</Typography>
        <Button variant="contained" color="primary" component={Link} to="/task/new">
          Create New Task
        </Button>
      </Box>
      <AppBar position="static">
        <Tabs value={priorityFilter} onChange={handlePriorityChange}>
          <Tab label="All" value="All" />
          <Tab label="High" value="High" />
          <Tab label="Medium" value="Medium" />
          <Tab label="Low" value="Low" />
        </Tabs>
      </AppBar>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} secondaryAction={
            <>
              <FormControl variant="outlined" size="small">
                <Select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(task)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText
              primary={<Link to={`/task/${task.id}`}>{task.title}</Link>}
              secondary={`Due: ${task.dueDate} - Status: ${task.status} - Priority: ${task.priority}`}
            />
          </ListItem>
        ))}
      </List>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Typography variant="body1">
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </Box>
      <Dialog
        open={Boolean(taskToDelete)}
        onClose={handleClose}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "{taskToDelete?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskList;
