import axios from 'axios';

const api = axios.create({
  baseURL: 'https://webv2-backend.studentperformancepredictor.ca',
});

export default api;
