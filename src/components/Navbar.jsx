import { Link } from 'react-router-dom';
import '../style.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>🗳️ PollApp</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
