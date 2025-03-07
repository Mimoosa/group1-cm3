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

### Example 2: Handling Date Format Issues in React

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

### 



