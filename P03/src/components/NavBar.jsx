import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <span className="brand">My Portfolio</span>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
