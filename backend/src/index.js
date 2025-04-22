const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dreamRoutes = require('./routes/dreamRoutes');
require('dotenv').config();

// Express uygulamasını oluştur
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/dreams', dreamRoutes);

// Ana sayfa
app.get('/', (req, res) => {
  res.send('FallApp API çalışıyor!');
});

// Veritabanı senkronizasyonu ve sunucuyu başlat
const startServer = async () => {
  try {
    // Veritabanı bağlantısını test et
    await testConnection();
    
    // Veritabanı tablolarını senkronize et
    await sequelize.sync({ alter: true });
    console.log('Veritabanı tabloları senkronize edildi.');
    
    // Sunucuyu başlat
    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    });
  } catch (error) {
    console.error('Sunucu başlatma hatası:', error);
    process.exit(1);
  }
};

startServer(); 