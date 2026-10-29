function RepoList({ repos }) {
  if (repos.length === 0) {
    return <p className="empty-message">No repositories match your search.</p>;
  }

  return (
    <div className="repo-grid">
      {repos.map((repo) => (
        <article className="repo-card" key={repo.id}>
          <h2>{repo.name}</h2>
          <p>{repo.description || 'No description available for this repository.'}</p>
          <p className="stars">★ {repo.stargazers_count} stars</p>
          <a href={repo.html_url} target="_blank" rel="noreferrer">View Repository</a>
        </article>
      ))}
    </div>
  );
}

export default RepoList;
