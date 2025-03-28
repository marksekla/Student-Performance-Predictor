import api from "./axios.config";

async function getAll() {
  return [
    {
      "_id": "feature-001",
      "name": "Real-time Student Performance Prediction",
      "description": "Leverages advanced machine learning algorithms to analyze student data in real-time, providing instant insights into academic performance. This feature identifies patterns in grades, participation, and assignment completion, allowing educators to make timely interventions and students to adjust their study habits proactively."
    },
    {
      "_id": "feature-002",
      "name": "Automated Learning Recommendations",
      "description": "Dynamically suggests personalized learning resources, such as video lectures, practice exercises, and reading materials, tailored to each student’s strengths and weaknesses. By continuously adapting to performance trends, this feature ensures students receive the most relevant study materials to maximize their learning potential."
    },
    {
      "_id": "feature-003",
      "name": "Dropout Risk Analysis",
      "description": "Uses predictive analytics to detect early warning signs of potential student dropouts. The system monitors declining engagement, irregular attendance, and poor academic performance to generate risk scores. Educators and advisors receive alerts to intervene early and provide necessary support to keep students on track."
    },
    {
      "_id": "feature-004",
      "name": "Predictive Grade Forecasting",
      "description": "Estimates future grades based on past academic performance, study habits, and test scores. This helps students set realistic academic goals, plan study schedules effectively, and allows educators to identify students who might need additional support before exams or major assessments."
    },
    {
      "_id": "feature-005",
      "name": "Early Warning System for Struggling Students",
      "description": "Automatically flags students who are falling behind based on assignment completion, test scores, and participation. Teachers receive notifications to take action, while students are provided with customized improvement plans to help them stay on course."
    }
  ];
}

async function getById(id: string) {
  const features = await getAll();
  return features.find(feature => feature._id === id) || null;
}

const ProjectAPI = {
  getAll,
  getById,
};

export default ProjectAPI;
