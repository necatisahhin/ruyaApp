import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL'si - geliştirme ortamında localhost yerine IP adresinizi kullanın
const API_URL = 'http://10.0.2.2:5000/api/dreams'; // Android Emulator için
// const API_URL = 'http://localhost:5000/api/dreams'; // iOS Simulator için

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token ekle
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

// Rüya kaydetme
export const saveDream = async (dreamData) => {
  try {
    const response = await api.post('/', dreamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Kullanıcının tüm rüyalarını getir
export const getUserDreams = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Tek bir rüyayı getir
export const getDream = async (dreamId) => {
  try {
    const response = await api.get(`/${dreamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Rüyayı güncelle
export const updateDream = async (dreamId, dreamData) => {
  try {
    const response = await api.put(`/${dreamId}`, dreamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Rüyayı sil
export const deleteDream = async (dreamId) => {
  try {
    const response = await api.delete(`/${dreamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Rüyayı favorilere ekle/çıkar
export const toggleFavorite = async (dreamId, isFavorite) => {
  try {
    const response = await api.put(`/${dreamId}`, { isFavorite });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
}; 