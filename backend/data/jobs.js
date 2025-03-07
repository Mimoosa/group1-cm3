const dummyJobs = [
  {
    title: "Software Engineer",
    type: "Full-time",
    description: "We are looking for a skilled Software Engineer to develop high-quality applications.",
    company: {
      name: "Tech Innovators Inc.",
      contactEmail: "hr@techinnovators.com",
      contactPhone: "123-456-7890",
      website: "https://www.techinnovators.com",
      size: 500,
    },
    location: "San Francisco, CA",
    salary: 120000,
    experienceLevel: "Mid",
    postedDate: new Date(),
    status: "open",
    applicationDeadline: new Date("2025-04-30"),
    requirements: ["JavaScript", "Node.js", "MongoDB", "React"],
  },
  {
    title: "Marketing Specialist",
    type: "Part-time",
    description: "Seeking a creative Marketing Specialist to manage campaigns and social media presence.",
    company: {
      name: "BrandBoost LLC",
      contactEmail: "careers@brandboost.com",
      contactPhone: "987-654-3210",
      website: "https://www.brandboost.com",
      size: 150,
    },
    location: "Remote",
    salary: 60000,
    experienceLevel: "Entry",
    postedDate: new Date(),
    status: "open",
    applicationDeadline: new Date("2025-05-15"),
    requirements: ["SEO", "Social Media Marketing", "Content Creation", "Google Ads"],
  },
];

module.exports = dummyJobs;
