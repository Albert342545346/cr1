import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000, // Увеличиваем таймаут
  withCredentials: false
});

// Проверка соединения
export const checkConnection = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api', {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    throw new Error('Backend не доступен. Убедитесь, что сервер запущен на http://localhost:3000');
  }
};

export const api = {
  getProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Не удалось подключиться к серверу. Убедитесь, что backend запущен (npm start в папке server)');
      }
      throw error;
    }
  },
  
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (product) => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },
  
  updateProduct: async (id, product) => {
    const response = await apiClient.patch(`/products/${id}`, product);
    return response.data;
  },
  
  deleteProduct: async (id) => {
    await apiClient.delete(`/products/${id}`);
    return;
  }
};