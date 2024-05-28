import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Button, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, FormControl } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async (page = 1) => {
    const response = await axios.get(`http://localhost:8080/tasks?_page=${page}&_limit=5`);
    setTasks(response.data);
    const totalTasks = parseInt(response.headers['x-total-count'], 10);
    setTotalPages(Math.ceil(totalTasks / 5));
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleClose = () => {
    setTaskToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await axios.delete(`http://localhost:8080/tasks/${taskToDelete.id}`);
      fetchTasks(page);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await axios.put(`http://localhost:8080/tasks/${task.id}`, { ...task, status });
      fetchTasks(page);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
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
              secondary={`Due: ${task.dueDate} - Status: ${task.status}`}
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
