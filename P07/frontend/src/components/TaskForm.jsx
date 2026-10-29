import { useEffect, useState } from 'react';

function TaskForm({ task, onSave, onCancel, saving }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
  }, [task]);

  function handleSubmit(event) {
    event.preventDefault();
    if (title.trim()) onSave({ title: title.trim(), description: description.trim(), completed: task?.completed || false });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{task ? 'Edit Task' : 'Add a Task'}</h2>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" required />
      <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" />
      <div className="form-actions">
        <button disabled={saving}>{saving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}</button>
        {task && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default TaskForm;
