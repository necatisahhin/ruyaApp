import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL'si - geliştirme ortamında localhost yerine IP adresinizi kullanın
const API_URL = 'http://10.0.2.2:5000/api/auth'; // Android Emulator için
// const API_URL = 'http://localhost:5000/api/auth'; // iOS Simulator için

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

// Kullanıcı kaydı
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Kullanıcı girişi
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Kullanıcı çıkışı
export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userData');
};

// Kullanıcı profili
export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};

// Oturum durumunu kontrol et
export const checkAuthStatus = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const userData = await AsyncStorage.getItem('userData');
  
  if (token && userData) {
    return JSON.parse(userData);
  }
  
  return null;
}; 