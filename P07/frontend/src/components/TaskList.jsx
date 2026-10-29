function TaskList({ tasks, onEdit, onDelete, saving }) {
  if (tasks.length === 0) return <p className="status">No tasks yet. Add your first task above.</p>;

  return (
    <section className="task-list">
      <h2>Your Tasks</h2>
      {tasks.map((task) => (
        <article className="task-card" key={task._id}>
          <div>
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <small>{task.completed ? 'Completed' : 'Pending'}</small>
          </div>
          <div className="card-actions">
            <button className="secondary" disabled={saving} onClick={() => onEdit(task)}>Edit</button>
            <button className="danger" disabled={saving} onClick={() => onDelete(task._id)}>Delete</button>
          </div>
        </article>
      ))}
    </section>
  );
}

export default TaskList;
