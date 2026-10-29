import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="hero">
      <h1>404 - Page Not Found</h1>
      <Link className="repo-link" to="/">Go back home</Link>
    </section>
  );
}

export default NotFound;
