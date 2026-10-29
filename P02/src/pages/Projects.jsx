const projects = [
  { title: 'Portfolio Page', description: 'A personal portfolio made with React components.' },
  { title: 'To-Do List', description: 'A simple task list to practise state management.' },
  { title: 'Weather UI', description: 'A responsive weather application interface.' },
];

function Projects() {
  return (
    <section>
      <h1>My Projects</h1>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
