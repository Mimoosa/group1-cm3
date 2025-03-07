import {Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../contexts/AuthContext'; 

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate(`/login`);
  };
  
  return (
    <nav className="navbar">
      <Link to="/">
        <h1>React Jobs</h1>
      </Link>
      <div className="links">
        {isAuthenticated && (
          <div>
            <Link to="/jobs/add-job">Add Job</Link>
              <Link to="/" onClick={handleClick} className={"btn"}>Log out</Link>
          </div>
        )}
        {!isAuthenticated && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
