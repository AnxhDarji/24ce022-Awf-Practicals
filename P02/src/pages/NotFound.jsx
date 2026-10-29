import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="hero">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="home-link" to="/">Go back home</Link>
    </section>
  );
}

export default NotFound;
