require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./models/Task');
const User = require('./models/User');
const authenticate = require('./middleware/authenticate');
const cache = require('./cache');
const taskEvents = require('./taskEvents');
require('./taskListeners');

const app = express();
const PORT = process.env.PORT || 8000;
const TASKS_CACHE_KEY = 'all_tasks';

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:8080' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

app.get('/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? 'ok' : 'unavailable' });
});

function validEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validPassword(password) {
  return typeof password === 'string' && password.trim().length >= 6;
}

app.post('/auth/register', async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!validEmail(email) || !validPassword(password)) {
    return res.status(400).json({ error: 'Enter a valid email and a password of at least 6 characters.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, password: hashedPassword });
    res.status(201).json({ message: 'Registration successful.', user: { id: user.id, email: user.email } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    next(error);
  }
});

app.post('/auth/login', async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!validEmail(email) || typeof password !== 'string' || password.trim().length === 0) {
    return res.status(400).json({ error: 'Enter a valid email and password.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
});

app.get('/me', authenticate, (req, res) => {
  res.status(200).json({ id: req.user.id, email: req.user.email });
});

app.get('/tasks', authenticate, async (req, res, next) => {
  try {
    if (cache.has(TASKS_CACHE_KEY)) {
      console.log('Task list cache HIT');
      return res.status(200).json(cache.get(TASKS_CACHE_KEY));
    }

    console.log('Task list cache MISS');
    const tasks = await Task.find().sort({ createdAt: -1 });
    cache.set(TASKS_CACHE_KEY, tasks);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

app.post('/tasks', authenticate, async (req, res, next) => {
  const title = req.body?.title;
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  try {
    const task = await Task.create({ ...req.body, title: title.trim() });
    cache.del(TASKS_CACHE_KEY);

    const taskInfo = {
      title: task.title,
      timestamp: new Date().toISOString(),
      userId: req.user.id,
    };
    taskEvents.emit('task-created', taskInfo);
    console.log(`[${new Date().toISOString()}] Emitted task-created for "${taskInfo.title}".`);
    console.log(`[${new Date().toISOString()}] Sending task creation response.`);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

app.put('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    cache.del(TASKS_CACHE_KEY);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

app.delete('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    cache.del(TASKS_CACHE_KEY);
    const taskInfo = {
      taskId: task.id,
      timestamp: new Date().toISOString(),
      userId: req.user.id,
    };
    taskEvents.emit('task-deleted', taskInfo);
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ error: messages.join(' ') });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: 'Invalid task ID.' });
  }
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in the environment.');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be set in the environment.');
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on 0.0.0.0:${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed. Verify MONGO_URI and database readiness.', error.name);
    process.exit(1);
  });
