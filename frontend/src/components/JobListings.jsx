import {Link} from 'react-router-dom';

const JobListings = ({jobs}) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        
        <div className="job-preview" key={job._id}>
          <h2>{job.title}</h2>
          <p>Type: {job.type}</p>
          <p>Description: {job.description}</p>
          <p>Location: {job.location}</p>
          <div className="align-row">
            <Link to={`/jobs/${job._id}`} className="btn">
              View Job
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListings;
