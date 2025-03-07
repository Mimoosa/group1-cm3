import useField from "../hooks/useField";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const userName = useField("text");
  const password = useField("password");
  
  const { login, error } = useLogin();
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await login({ username: userName.value, password: password.value });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };
  
  return (
    <div className="create">
      <h2>Log In</h2>
      <form onSubmit={handleFormSubmit}>
        <label>User Name:</label>
        <input {...userName} />
        <label>Password:</label>
        <input {...password} />
        <button>Log In</button>
      </form>
    </div>
  );
};

export default Login;
