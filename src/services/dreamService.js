import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://localhost:5001/api/dreams';



const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const saveDream = async (dreamData) => {
  try {
    const response = await api.post('/', dreamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};


export const getUserDreams = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};


export const getDream = async (dreamId) => {
  try {
    const response = await api.get(`/${dreamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};


export const updateDream = async (dreamId, dreamData) => {
  try {
    const response = await api.put(`/${dreamId}`, dreamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};


export const deleteDream = async (dreamId) => {
  try {
    const response = await api.delete(`/${dreamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};


export const toggleFavorite = async (dreamId, isFavorite) => {
  try {
    const response = await api.put(`/${dreamId}`, { isFavorite });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
}; 