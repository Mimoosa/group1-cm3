import {Link} from 'react-router-dom';

const JobListings = ({jobs}) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        
        <div className="job-preview" key={job.id}>
          <h2>{job.title}</h2>
          <p>Type: {job.category}</p>
          <p>Description: {job.description}</p>
          <p>Price: {job.price}</p>
          <div className="align-row">
            <Link to={`/jobs/${job.id}`} className="btn">
              View Job
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListings;
