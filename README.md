# Rüya Tabirleri Mobil Uygulaması

Bu proje, React Native ve Expo ile geliştirilmiş, kullanıcıların rüyalarını kaydetmesine ve yorumlatmasına olanak sağlayan bir mobil uygulamadır.

## İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Proje Yapısı](#proje-yapısı)
- [Özellikler](#özellikler)
- [Ekranlar](#ekranlar)
- [Bileşenler](#bileşenler)
- [Navigasyon](#navigasyon)
- [Veri Yönetimi](#veri-yönetimi)
- [Kullanıcı Arayüzü](#kullanıcı-arayüzü)

## Proje Hakkında

Rüya Tabirleri uygulaması, kullanıcıların rüyalarını kaydedebilecekleri, kategorilere ayırabilecekleri ve yorumlatabilecekleri bir mobil uygulamadır. Uygulama, modern ve kullanıcı dostu bir arayüz ile kullanıcılara rüyalarını yönetme imkanı sağlar.

## Teknolojiler

Bu projede kullanılan temel teknolojiler:

- **React Native**: Mobil uygulama geliştirme çerçevesi
- **Expo**: Geliştirme sürecini kolaylaştıran araç seti
- **TypeScript**: Tip güvenliği sağlayan JavaScript süper kümesi
- **React Navigation**: Sayfa yönlendirme ve navigasyon yönetimi
- **Async Storage**: Yerel depolama için kullanılan API
- **Axios**: HTTP istekleri için kullanılan kütüphane
- **React Native Reanimated**: Gelişmiş animasyonlar için kütüphane
- **Expo Linear Gradient**: Gradyan efektleri için kullanılan kütüphane
- **React Native Responsive Screen**: Ekran boyutuna duyarlı tasarım için kullanılan kütüphane

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Projeyi klonlayın:
```bash
git clone <repo-url>
cd RuyaTabirleri
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Expo projesini başlatın:
```bash
npx expo start
```

4. Uygulamayı test etmek için:
   - iOS için: `i` tuşuna basın veya iOS simülatörünü kullanın
   - Android için: `a` tuşuna basın veya Android simülatörünü kullanın
   - Fiziksel cihazda: Expo Go uygulamasını yükleyin ve QR kodu okutun

## Proje Yapısı

Proje, aşağıdaki klasör yapısına sahiptir:

```
RuyaTabirleri/
  ├── assets/           # Uygulama görselleri, fontları ve statik dosyaları
  ├── src/
  │   ├── components/   # Yeniden kullanılabilir UI bileşenleri
  │   ├── navigation/   # Navigasyon yapılandırması
  │   ├── screens/      # Uygulama ekranları
  │   ├── models/       # Veri modelleri ve tipler
  │   ├── services/     # API istekleri ve servisler
  │   └── utils/        # Yardımcı fonksiyonlar ve araçlar
  ├── App.tsx           # Ana uygulama bileşeni
  ├── app.json          # Expo yapılandırması
  ├── package.json      # Bağımlılıklar ve betikler
  └── tsconfig.json     # TypeScript yapılandırması
```

## Özellikler

Uygulamanın temel özellikleri şunlardır:

1. **Kullanıcı Kimlik Doğrulama**
   - Kayıt olma
   - Giriş yapma
   - Şifremi unuttum

2. **Rüya Yönetimi**
   - Rüya kaydetme
   - Rüya listeleme
   - Rüya silme
   - Favorilere ekleme/çıkarma

3. **Rüya Yorumlama**
   - Rüya yorumlatma
   - Yorumları kaydetme
   - Yorumları paylaşma

4. **Kullanıcı Arayüzü**
   - Arama ve filtreleme
   - Kategori bazlı filtreleme
   - Modern ve akıcı animasyonlar
   - Bildirim sistemi (Toast Messages)

5. **Veri Senkronizasyonu**
   - Sunucu ile veri senkronizasyonu
   - Çevrimdışı kullanım desteği

## Ekranlar

### 1. Giriş ve Kayıt Ekranları
- **LoginScreen**: Kullanıcı girişi
- **RegisterScreen**: Yeni kullanıcı kaydı

### 2. Ana Ekranlar
- **RuyaList**: Kaydedilmiş rüyaların listesi
- **RuyaBak**: Rüya yorumlama ekranı
- **ProfileScreen**: Kullanıcı profili ve ayarlar

### 3. Rüya Detay Ekranları
- **RuyaYorumSonucScreen**: Rüya yorumlama sonucunu gösteren ekran

## Bileşenler

### UI Bileşenleri
- **RuyaCard**: Rüya kartı bileşeni
- **SearchBar**: Arama çubuğu
- **FilterBar**: Filtreleme çubuğu
- **CustomTabBar**: Özelleştirilmiş alt navigasyon çubuğu
- **CustomHeader**: Özelleştirilmiş başlık çubuğu
- **EmptyStateMessage**: Boş durum mesajı

### Util Bileşenleri
- **ToastManager**: Bildirim sistemi
- **ToastContainer**: Bildirim gösterim konteynerı

## Navigasyon

Uygulama, 3 farklı navigasyon yapısı kullanmaktadır:

1. **RootNavigator**: Ana navigasyon yapısı
   - Auth Stack (Giriş ve Kayıt)
   - Tab Navigator (Ana ekranlar)
   - Modal ekranlar (Rüya yorumlama sonucu)

2. **AuthNavigator**: Kimlik doğrulama ekranları için
   - Login
   - Register

3. **TabNavigator**: Ana ekranlar için alt navigasyon
   - RuyaList (Rüyalarım)
   - RuyaBak (Rüya Yorumlama)
   - Profil

## Veri Yönetimi

### Modeller
- **RuyaModel**: Rüya verilerinin yapısını tanımlar
  ```typescript
  interface Ruya {
    id: string;
    baslik: string;
    icerik: string;
    tarih?: Date;
    isFavorite?: boolean;
    kategori: string;
    yorum?: string;
  }
  ```

### API Servisleri
- **authService**: Kimlik doğrulama işlemleri
- **dreamService**: Rüya CRUD işlemleri

### Yerel Depolama
- **AsyncStorage**: Kullanıcı oturum bilgileri ve çevrimdışı veri saklama

## Kullanıcı Arayüzü

### Tema ve Stiller
- **Renk Paleti**:
  - Ana Renkler: #2D2D7D, #4C4CA6, #6060CF
  - Vurgu Renkleri: #FF6B6B, #FF9800, #4CAF50
  - Arka Plan: #FFFFFF, #F8F8F8
  - Metin: #333333, #666666

- **Gradyanlar**: Uygulama içinde özellikle RuyaCard ve Sonuç ekranlarında Linear Gradient kullanılmıştır.

### Animasyonlar
Uygulama içinde React Native Reanimated kütüphanesi kullanılarak çeşitli animasyonlar uygulanmıştır:
- Kart açılma/kapanma animasyonları
- Favori butonları için geri bildirim animasyonları
- Toast bildirimleri için giriş/çıkış animasyonları
- Arka plan parlaklık efektleri

### Duyarlı Tasarım
`react-native-responsive-screen` kütüphanesi kullanılarak, uygulama farklı ekran boyutlarına uyum sağlayacak şekilde tasarlanmıştır:
- Yüzde bazlı boyutlandırma (hp, wp)
- Farklı cihazlara uyumlu UI bileşenleri

## Adım Adım Uygulama Kullanımı

1. **Uygulama Başlatma**
   - Uygulamayı ilk açtığınızda giriş ekranı karşınıza çıkar
   - Hesabınız yoksa "Kayıt Ol" butonuna tıklayarak yeni hesap oluşturabilirsiniz

2. **Kullanıcı Kaydı**
   - Ad, soyad, e-posta ve şifre bilgilerinizi girerek kayıt olabilirsiniz
   - Şifre en az 6 karakter olmalıdır
   - Başarılı kayıt sonrası giriş ekranına yönlendirilirsiniz

3. **Kullanıcı Girişi**
   - E-posta ve şifrenizi girerek giriş yapabilirsiniz
   - "Şifremi Unuttum" seçeneği ile şifrenizi sıfırlayabilirsiniz
   - Başarılı giriş sonrası ana ekrana yönlendirilirsiniz

4. **Rüyalarım Ekranı**
   - Kaydettiğiniz rüyaları bu ekranda görüntüleyebilirsiniz
   - Sağ üstteki "Arama" butonu ile rüyalarınız arasında arama yapabilirsiniz
   - "Filtre" butonu ile kategorilere veya favori durumuna göre filtreleme yapabilirsiniz
   - Rüya kartlarını kaydırarak menü açabilir, favori yapabilir, paylaşabilir veya silebilirsiniz

5. **Rüya Yorumlama**
   - "Rüya Bak" sekmesinden yeni bir rüya yorumlatabilirsiniz
   - Rüya başlığı, içeriği ve kategori bilgilerini girmeniz gerekir
   - "Yorumla" butonuna tıklayarak rüya yorumunu alabilirsiniz
   - Yorum sonucunda rüyanızı kaydedebilir veya paylaşabilirsiniz

6. **Profil Ekranı**
   - Kişisel bilgilerinizi görüntüleyebilir ve düzenleyebilirsiniz
   - Şifrenizi değiştirebilirsiniz
   - Bildirim ayarlarını yapabilirsiniz
   - Uygulamadan çıkış yapabilirsiniz

## Sonuç

Rüya Tabirleri uygulaması, modern React Native teknolojileri kullanılarak geliştirilmiş, kullanıcı dostu ve estetik bir mobil uygulamadır. TypeScript ile tip güvenliği sağlanmış, React Navigation ile karmaşık navigasyon yapısı oluşturulmuş ve React Native Reanimated ile akıcı animasyonlar eklenmiştir.

Uygulama, rüya yönetimi ve yorumlama konusunda kullanıcılara kapsamlı bir deneyim sunmaktadır. 