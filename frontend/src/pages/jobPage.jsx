import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { jobApi } from "../services/api";
import Logger from "../utils/logger";

const JobPage = ({ isAuthenticated }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteJob = async (id) => {
    try {
      Logger.info('Attempting to delete job', { jobId: id });
      const res = await jobApi.deleteJob(id, token);
      if (!res.ok) {
        Logger.error('Failed to delete job', { jobId: id, status: res.status });
        throw new Error('Failed to delete job');
      }
      Logger.info('Job deleted successfully', { jobId: id });
    } catch (error) {
      Logger.error('Error deleting job', { jobId: id, error: error.message });
      console.error('Error deleting job:', error);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        Logger.info('Fetching job details', { jobId: id });
        const data = await jobApi.getJob(id);
        Logger.info('Job details fetched successfully', { jobId: id });
        setJob(data);
      } catch (err) {
        Logger.error('Failed to fetch job details', { jobId: id, error: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const onDeleteClick = (jobId) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this listing?' + jobId
    );
    if (!confirm) {
      Logger.info('Job deletion cancelled by user', { jobId });
      return;
    }

    deleteJob(jobId);
    navigate('/');
  };

  return (
    <div className="job-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{job.title}</h2>
          <p>Type: {job.type}</p>
          <p>Description: {job.description}</p>
          <p>Company: {job.company.name}</p>
          <p>Email: {job.company.contactEmail}</p>
          <p>Phone: {job.company.contactPhone}</p>
          <p>Website: {job.company.website}</p>
          <p>Size: {job.company.size}</p>
          <p>Location: {job.location}</p>
          <p>Salary: {job.salary}</p>
          <p>Experience Level: {job.experienceLevel}</p>
          <p>Posted Date: {new Date(job.postedDate).toLocaleDateString()}</p>
          <p>Status: {job.status}</p>
          <p>Application Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "N/A"}</p>
          <p>Requirements: {job.requirements.join(", ")}</p>

          {isAuthenticated &&
            <div className="align-row">
              <Link to={`/edit-job/${job._id}`} className={"btn"}>Edit</Link>
              <Link to='/' className="btn"
                onClick={() => onDeleteClick(job._id)}>Delete</Link>
            </div>
          }
        </>
      )}
    </div>
  );
};

export default JobPage;
