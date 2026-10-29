import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from './api';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast from './components/Toast';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  async function loadTasks() {
    setLoading(true);
    setError('');
    try {
      setTasks(await getTasks());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    function handleAuthExpired() {
      setToken(null);
      setError('Your session expired. Please log in again.');
    }
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  function handleAuthenticated(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setError('');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setEditingTask(null);
    setError('');
  }

  async function handleSave(taskData) {
    setSaving(true);
    setError('');
    try {
      if (editingTask) {
        const updatedTask = await updateTask(editingTask._id, taskData);
        setTasks((currentTasks) => currentTasks.map((task) => task._id === updatedTask._id ? updatedTask : task));
        setToast('Task updated successfully.');
        setEditingTask(null);
      } else {
        const newTask = await createTask(taskData);
        setTasks((currentTasks) => [newTask, ...currentTasks]);
        setToast('Task created successfully.');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    setSaving(true);
    setError('');
    try {
      await deleteTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== id));
      setToast('Task deleted successfully.');
      if (editingTask?._id === id) setEditingTask(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <header>
        <h2>24CE022</h2>
        <p>FULL STACK PRACTICAL 7</p>
        <h1>Task Manager</h1>
        <span>React + Express + MongoDB + JWT</span>
      </header>
      <main>
        {!token ? (
          <>
            {error && <div className="error" role="alert">{error}</div>}
            <AuthForm onAuthenticated={handleAuthenticated} />
          </>
        ) : (
          <>
            <div className="toolbar"><span>Signed in</span><button className="secondary" onClick={handleLogout}>Log Out</button></div>
            <TaskForm
              task={editingTask}
              onSave={handleSave}
              onCancel={() => setEditingTask(null)}
              saving={saving}
            />
            {error && <div className="error" role="alert">{error} <button onClick={loadTasks}>Retry</button></div>}
            {loading ? <p className="status">Loading tasks...</p> : <TaskList tasks={tasks} onEdit={setEditingTask} onDelete={handleDelete} saving={saving} />}
          </>
        )}
      </main>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default App;
