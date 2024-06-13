const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Define Task Schema
    const taskSchema = new mongoose.Schema({
      title: String,
      description: String,
      status: String,
      createdAt: { type: Date, default: Date.now },
    });

    const Task = mongoose.model('Task', taskSchema);

    // CRUD Operations
    app.get('/api/tasks', async (req, res) => {
      const tasks = await Task.find();
      res.send(tasks);
    });

    app.get('/api/tasks/:id', async (req, res) => {
      console.log('Fetching task with ID:', req.params.id);
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }
      res.send(task);
    });

    app.post('/api/tasks', async (req, res) => {
      const task = new Task(req.body);
      await task.save();
      res.send(task);
    });

    app.put('/api/tasks/:id', async (req, res) => {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }
      res.send(task);
    });

    app.delete('/api/tasks/:id', async (req, res) => {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }
      res.send({ message: 'Task deleted' });
    });

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
