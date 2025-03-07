import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditJobPage = () => {
  const [job, setJob] = useState(null); // Initialize job state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  // Declare state variables for form fields
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
  const [postedDate, setPostedDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("open");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [requirements, setRequirements] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  const updateJob = async (job) => {
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error("Failed to update job");
      return res.ok;
    } catch (error) {
      console.error("Error updating job:", error);
      return false;
    }
  };

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
        try {
          console.log(id)
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setJob(data);

        // Initialize form fields with fetched job data
        setTitle(data.title);
        setType(data.type);
        setDescription(data.description);
        setCompanyName(data.company.name);
        setContactEmail(data.company.contactEmail);
        setContactPhone(data.company.contactPhone);
        setWebsite(data.company.website);
        setSize(data.company.size);
        setLocation(data.location);
        setSalary(data.salary);
        setExperienceLevel(data.experienceLevel);
        setPostedDate(data.postedDate.split('T')[0]);
        setStatus(data.status);
        setApplicationDeadline(data.applicationDeadline ? data.applicationDeadline.split('T')[0] : "");
        setRequirements(data.requirements);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchJob();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const updatedJob = {
      id,
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
      postedDate,
      status,
      applicationDeadline,
      requirements,
    };

    const success = await updateJob(updatedJob);
    if (success) {
      navigate(`/jobs/${id}`);
    } else {
      console.error("Failed to update the job");
    }
  };

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  return (
    <div className="create">
      <h2>Edit Job</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
          <label>Job Title:</label>
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
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <label>Contact Email:</label>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <label>Contact Phone:</label>
          <input
            type="tel"
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <label>Website:</label>
          <input
            type="url"
            required
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <label>Company Size:</label>
          <input
            type="number"
            required
            value={size}
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
          <label>Posted Date:</label>
          <input
            type="date"
            value={postedDate}
            onChange={(e) => setPostedDate(e.target.value)}
          />
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
          <button type="submit">Update Job</button>
        </form>
      )}
    </div>
  );
};

export default EditJobPage;
