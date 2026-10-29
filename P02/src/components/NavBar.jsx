import { NavLink } from 'react-router-dom';

function NavBar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <span className="brand">My Portfolio</span>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
      <button className="theme-button" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </nav>
  );
}

export default NavBar;
