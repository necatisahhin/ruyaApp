import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://localhost:5001/api/auth';



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


export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userData');
};


export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};


export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/profile/update', userData);
    
    // Profil güncellendiğinde userData'yı da güncelle
    if (response.data.success) {
      const currentUserData = await AsyncStorage.getItem('userData');
      if (currentUserData) {
        const parsedUserData = JSON.parse(currentUserData);
        const updatedUserData = { ...parsedUserData, ...response.data.data };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Sunucu hatası' };
  }
};


export const checkAuthStatus = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const userData = await AsyncStorage.getItem('userData');
  
  if (token && userData) {
    return JSON.parse(userData);
  }
  
  return null;
}; 