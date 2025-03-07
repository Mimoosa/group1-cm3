# Self_Assessment for Frontend

## Example 1: Managing Arrays in Dynamic React Forms
Initially, our implementation for handling requirements started with const [requirements, setRequirements] = useState("");. At the beginning, I was unsure how to manage arrays within a form, so I approached it as if it were a standard, non-array input.

After figuring out with LLM, the solution code is following:
```jsx
const [requirements, setRequirements] = useState([]);

const handleAddRequirement = () => {
  setRequirements([...requirements, ""]);
};

const handleRequirementChange = (index, value) => {
  const newRequirements = [...requirements];
  newRequirements[index] = value;
  setRequirements(newRequirements);
};

{return requirements.map((requirement, index) => (
    <input
      key={index}
      type="text"
      value={requirement}
      onChange={(e) => handleRequirementChange(index, e.target.value)}
    />
  ))}
<button type="button" onClick={handleAddRequirement}>Add Requirement</button>
```
### Key Points Summary:

- Dynamic Handling: Use of the map method to render input fields dynamically based on the current state of the array.
- User Interaction: Allows users to dynamically add new fields and update existing ones, enhancing the form's flexibility and usability.

### Self-Grading:
- Functionality: 10/10 - The form dynamically handles arrays and allows for adding and updating fields as intended.
- Code Quality: 9/10 - The code is clean and readable, with meaningful variable names and modular functions.
- User Experience: 10/10 - The form is user-friendly and intuitive.


## Example 2: Handling Date Format Issues in React

Initially, our implementation for setting dates in our form looked something like this:
```jsx
setPostedDate(data.postedDate);
setApplicationDeadline(data.applicationDeadline);

```
However, this approach caused errors due to the differing formats of the date data. The postedDate and applicationDeadline values were in ISO format and needed to be formatted correctly for the form input.

After identifying the issue, we refactored the code to handle the date format conversion effectively:
```jsx
setPostedDate(data.postedDate.split('T')[0]);
setApplicationDeadline(data.applicationDeadline ? data.applicationDeadline.split('T')[0] : "");

```

### Key Improvements:
- Date Format Conversion: Implemented a method to convert ISO date strings to a format that is compatible with form inputs. The split('T')[0] method was used to extract the date portion of the ISO string.
- Error Handling: Added a conditional check for applicationDeadline to ensure it only attempts to format the date if a value is present, preventing potential errors when the date is missing.

### Self-Grading:
- unctionality: 10/10 - The date format conversion works as intended, ensuring dates are displayed correctly in the form inputs.
- Code Quality: 9/10 - The code is clean and readable, with meaningful variable names and clear logic.
- Performance: 9/10 - The code is efficient and performs well with the current requirements.
- User Experience: 10/10 - The form inputs display dates in a user-friendly format, enhancing the overall user experience.

## Example 3: Preventing Unauthorized Access to Edit/Delete Buttons

Initially, our implementation for providing access to the edit and delete buttons looked something like this:
```jsx
<div className="align-row">
  <Link to={`/edit-job/${job.id}`} className={"btn"}>Edit</Link>
  <Link to='/' className="btn" onClick={() => onDeleteClick(job._id)}>Delete</Link>
</div>
```
This approach did not prevent unauthorized users from accessing the edit and delete buttons. To address this issue, we added an authentication check to ensure that only authorized users can see and interact with these buttons:
```jsx
{isAuthenticated &&
  <div className="align-row">
    <Link to={`/edit-job/${job._id}`} className={"btn"}>Edit</Link>
    <Link to='/' className="btn" onClick={() => onDeleteClick(job._id)}>Delete</Link>
  </div>
}
```
### Key Improvements:
- Authentication Check: Added a conditional rendering based on the isAuthenticated flag to ensure that only authorized users can access the edit and delete buttons.
- User Experience: Improved the user interface by showing the edit and delete buttons only to users who have the necessary permissions, reducing confusion for unauthorized users.

### Self-Grading:
- Functionality: 10/10 - The authentication check works as intended, preventing unauthorized access to the edit and delete buttons.
- Code Quality: 9/10 - The code is clean and readable, with clear logic and meaningful variable names.
- Security: 10/10 - The authentication check significantly enhances security by ensuring only authorized users can access sensitive actions.
- User Experience: 10/10 - The interface is more intuitive, showing buttons only to users with the necessary permissions.

## Example 4: Ensuring Proper Navigation After Logout in React
Initially, our implementation for handling the logout process in the Navbar component did not include navigation after the logout action.

The initial approach led to an issue where, if an authorized user logged out while on a page that only authorized users can access, they would remain on that page even after logging out. To address this, we added navigation to redirect users to the login page after logging out:

```jsx
const Navbar = ({isAuthenticated, setIsAuthenticated}) => {
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

```

### Key Improvements:
- Proper Navigation After Logout: Added the navigate function to redirect users to the login page after logging out, ensuring they do not remain on restricted pages.
- User Experience: Improved the overall user experience by ensuring a smooth transition to the login page after logging out.
- Security Enhancement: Prevented unauthorized access to restricted pages after logout, enhancing the security of the application.

### Self-Grading:
- Functionality: 10/10 - The navigation works as intended, redirecting users to the login page after logging out.
- Code Quality: 9/10 - The code is clean and readable, with clear logic and meaningful variable names.
- Performance: 9/10 - The code performs well with the current requirements, with minimal impact on performance.
- Security: 10/10 - The navigation enhances security by ensuring users are redirected to the login page after logging out.
- User Experience: 10/10 - The interface is more intuitive, providing a smooth transition after logging out.

## Example5: Refactoring Authentication Handling with Context API

### Before Improvement:
The initial implementation used props to pass the isAuthenticated and setIsAuthenticated state down to child components:
```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });
  
  
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobPage isAuthenticated={isAuthenticated} />} />
            <Route
              path="/jobs/add-job"
              element={isAuthenticated ? <AddJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/edit-job/:id"
              element={isAuthenticated ? <EditJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
```

### After improvement:
The code was refactored to use the Context API, providing a more efficient way to manage and share authentication state across the application:
```jsx
// src/contexts/AuthContext.js
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
```

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import AuthContext from './contexts/AuthContext' 
import { useAuthContext } from './contexts/AuthContext'; 

const AppContent = () => {
  const { isAuthenticated } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobPage />} />
            <Route
              path="/jobs/add-job"
              element={isAuthenticated ? <AddJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/edit-job/:id"
              element={isAuthenticated ? <EditJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });
  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
        <AppContent />
    </AuthContext.Provider>
  );
};

export default App;
```
### Key Improvements:
- State Management: Moved the isAuthenticated state management to a context provider, making it accessible to all components in the app without passing props through multiple levels.
- Code Readability: Improved the readability and maintainability of the code by centralizing authentication logic in a context.
- Reusability: Enhanced the reusability of components by removing the need to pass authentication-related props through multiple components.
- Scalability: Made the application more scalable by providing a flexible and efficient way to manage and share global state.

### Self-Grading:
- Functionality: 10/10 - The context implementation works as intended, providing global authentication state management.
- Code Quality: 9/10 - The code is clean and readable, with clear logic and meaningful variable names.
- Performance: 9/10 - The code performs well with the current requirements, with minimal impact on performance.


