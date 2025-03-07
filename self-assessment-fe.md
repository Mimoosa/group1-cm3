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




