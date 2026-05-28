import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // URL dasar backend Anda
  withCredentials: true, // Otomatis aktif untuk semua request
});

export default API;