import {Link} from 'react-router-dom';

const Navbar = ({isAuthenticated, setIsAuthenticated}) => {
  const handleClick = (e) => {
    e.preventDefault();
    
    setIsAuthenticated(false);
    localStorage.removeItem('user');
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
