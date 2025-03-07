import {useParams, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext'; 

const JobPage = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuthContext();
  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;
  
  const deleteJob = async (id) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log('id: ', id);
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);
  
  const onDeleteClick = (jobId) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this listing?' + jobId,
    );
    if (!confirm) return;
    
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
          
          {isAuthenticated&&
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
