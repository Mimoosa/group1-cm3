import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry");
  const [status, setStatus] = useState("open");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [requirements, setRequirements] = useState([]);

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();
 
  const addJob = async (newJob) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });
      if (!res.ok) {
        throw new Error("Failed to add job");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();

    const newJob = {
      title,
      type,
      description,
      company: {
        name: companyName,
        contactEmail,
        contactPhone,
        website,
        size,
      },
      location,
      salary,
      experienceLevel,
      status,
      applicationDeadline,
      requirements,
    };

    addJob(newJob);
    return navigate("/");
  };

  return (
    <div className="create">
      <h2>Add a New Job</h2>
      <form onSubmit={submitForm}>
        <label>Job title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Job Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        <label>Job Description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Company Name:</label>
        <input
          type="text"
          required
          value={companyName}
          onChange={(e) => setSupplierName(e.target.value)}
        />
        <label>Contact Email:</label>
        <input
          type="text"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label>Contact Phone:</label>
        <input
          type="text"
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <label>Company Website:</label>
        <input
          type="text"
          required
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
         <label>Company Size:</label>
        <input
          type="text"
          required
          value={website}
          onChange={(e) => setSize(e.target.value)}
        />
        <label>Location:</label>
        <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
        />
        <label>Salary:</label>
        <input
            type="number"
            required
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
        />
        <label>Experience Level:</label>
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
            <option value="Entry">Entry</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
        </select>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
        </select>

        <label>Application Deadline:</label>
        <input
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
        />

        <label>Requirements:</label>
        {requirements.map((requirement, index) => (
            <input
            key={index}
            type="text"
            value={requirement}
            onChange={(e) => handleRequirementChange(index, e.target.value)}
            />
            ))}
        <button type="button" onClick={handleAddRequirement}>Add Requirement</button>
        <button>Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;
