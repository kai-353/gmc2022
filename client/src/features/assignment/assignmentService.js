import axios from "axios";

const API_URL = "/api/assignments/";

const getAssignments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "all", config);

  return response.data;
};

const assignmentService = {
  getAssignments,
};

export default assignmentService;
