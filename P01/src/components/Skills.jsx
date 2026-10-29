function Skills({ skillList }) {
  return (
    <section className="card" id="skills">
      <h2>My Skills</h2>
      <ul className="skill-list">
        {skillList.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
