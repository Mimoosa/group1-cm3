import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../contexts/AuthContext'; 

const Signup = () => {
  const { setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const name = useField("text");
  const username = useField("text");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const membershipStatus = useField("text");
  const bio = useField("text");
  const address = useField("text");
  const profilePicture = useField("text");
  
  const { signup, error } = useSignup("/api/users/signup");
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      name: name.value,
      username: username.value,
      password: password.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      membership_status: membershipStatus.value,
      bio: bio.value,
      address: address.value,
      profile_picture: profilePicture.value,
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };
  
  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
      <label>Name:</label>

        <input {...name} />
        <label>Username:</label>
        <input {...username} />
        <label>Password:</label>
        <input {...password} />
        <label>Phone Number:</label>
        <input {...phoneNumber} />
        <label>Gender:</label>
        <input {...gender} />
        <label>Date of Birth:</label>
        <input {...dateOfBirth} />
        <label>Membership Status:</label>
        <input {...membershipStatus} />
        <label>Bio:</label>
        <input {...bio} />
        <label>Address:</label>
        <input {...address} />
        <label>Profile Picture:</label>
        <input {...profilePicture} />
        <button>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
