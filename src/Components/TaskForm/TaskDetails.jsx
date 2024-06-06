import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, FormControl, Select, MenuItem } from '@mui/material';

const TaskDetails = ({ authUser }) => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tasks/${id}`);
        if (response.data.userId !== authUser.id) {
          navigate('/');
          return;
        }
        setTask(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setDueDate(response.data.dueDate);
        setPriority(response.data.priority);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    fetchTask();
  }, [id, authUser.id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/tasks/${id}`, {
        title,
        description,
        dueDate,
        priority,
        status,
        userId: authUser.id
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!task) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleUpdate}>
      <Typography variant="h4" gutterBottom>Task Details</Typography>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={4} required />
      <TextField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} required />
      <FormControl fullWidth>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" fullWidth>Update Task</Button>
      <Button variant="contained" color="secondary" onClick={handleDelete} fullWidth>Delete Task</Button>
    </Box>
  );
};

export default TaskDetails;
