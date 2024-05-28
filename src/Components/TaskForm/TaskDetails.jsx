import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, CircularProgress, TextField, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, FormControl } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const TaskDetails = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tasks/${id}`);
        const taskData = response.data;
        setTask(taskData);
        setTitle(taskData.title);
        setDescription(taskData.description);
        setDueDate(taskData.dueDate);
        setPriority(taskData.priority);
        setStatus(taskData.status);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTask = { title, description, dueDate, priority, status };
    try {
      await axios.put(`http://localhost:8080/tasks/${id}`, updatedTask);
      history.push('/');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${id}`);
      history.push('/');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!task) {
    return <Typography variant="h6">Task not found</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Priority"
              select
              variant="outlined"
              fullWidth
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update Task
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteDialogOpen}
              style={{ marginLeft: '10px' }}
            >
              Delete Task
            </Button>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "{task.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskDetails;
