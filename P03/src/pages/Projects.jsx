import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import RepoList from '../components/RepoList';

const API_URL = 'https://api.github.com/users/octocat/repos?sort=updated&per_page=10';

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  async function fetchRepos() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }
      const data = await response.json();
      setRepos(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRepos} />;

  return (
    <section>
      <h1>GitHub Repositories</h1>
      <p className="page-intro">Repositories are loaded dynamically from the public GitHub API.</p>
      <label className="search-label" htmlFor="repo-search">Search by repository name</label>
      <input
        id="repo-search"
        className="search-input"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search repositories..."
      />
      <RepoList repos={filteredRepos} />
    </section>
  );
}

export default Projects;
