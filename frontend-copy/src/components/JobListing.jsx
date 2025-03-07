const JobListing = ({job}) => {
  return (
    <div className="job-preview">
      <h2>{job.title}</h2>
      <p>Type: {job.category}</p>
      <p>Description: {job.description}</p>
      <p>Price: {job.price}</p>
    </div>
  );
};

export default JobListing;
