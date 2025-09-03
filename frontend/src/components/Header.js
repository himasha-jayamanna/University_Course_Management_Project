import { NavLink } from "react-router-dom";
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">University Course Management System</h1>
      <nav className="nav-links">
        <NavLink to="/" end className="nav-item">Home</NavLink>
        <NavLink to="/students" className="nav-item">Students</NavLink>
        <NavLink to="/courses" className="nav-item">Courses</NavLink>
        <NavLink to="/registrations" className="nav-item">Registrations</NavLink>
        <NavLink to="/results" className="nav-item">Results</NavLink>
      </nav>
    </header>
  );
}

export default Header;
