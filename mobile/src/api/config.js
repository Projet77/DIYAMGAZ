import axios from 'axios';

// Utiliser l'IP de la machine locale de développement
// Exemple: http://192.168.1.100:5000/api
// Ne pas utiliser localhost sinon l'émulateur Android ou le téléphone cherchera sur lui-même
const API_URL = 'http://192.168.1.116:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
