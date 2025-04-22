# FallApp Backend API

Bu proje, FallApp uygulamasının backend API'sini içerir. Node.js, Express ve PostgreSQL kullanılarak geliştirilmiştir.

## Kurulum

1. PostgreSQL veritabanını kurun ve çalıştırın
2. `.env` dosyasındaki veritabanı bilgilerini kendi ortamınıza göre düzenleyin
3. Bağımlılıkları yükleyin:
   ```
   npm install
   ```
4. Sunucuyu başlatın:
   ```
   npm run dev
   ```

## API Endpointleri

### Kimlik Doğrulama

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Kullanıcı profili (kimlik doğrulama gerektirir)

## Veritabanı Modeli

### User

- `id` - Otomatik artan birincil anahtar
- `firstName` - Kullanıcının adı
- `lastName` - Kullanıcının soyadı
- `email` - Kullanıcının e-posta adresi (benzersiz)
- `phone` - Kullanıcının telefon numarası
- `password` - Kullanıcının şifresi (hashlenir)
- `age` - Kullanıcının yaşı
- `gender` - Kullanıcının cinsiyeti (male, female, other)
- `maritalStatus` - Kullanıcının medeni durumu (single, married, divorced, widowed)
- `profileImage` - Kullanıcının profil resmi (isteğe bağlı)
- `createdAt` - Kayıt tarihi
- `updatedAt` - Son güncelleme tarihi 