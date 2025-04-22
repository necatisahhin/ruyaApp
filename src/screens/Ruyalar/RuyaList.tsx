import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styles from "./RuyaListStyles";
import { Ruya } from "../../models/RuyaModel";
import RuyaCard from "../../components/RuyaCard/RuyaCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import EmptyStateMessage from "../../components/EmptyStateMessage/EmptyStateMessage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
// useToast yerine ToastManager'ı import ediyoruz
import { ToastManager } from "../../utils/ToastManager";
import { Ionicons } from "@expo/vector-icons"; // Hala gerekli olabilecek ikonlar için
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
// Backend servislerini import ediyorum
import { getUserDreams, toggleFavorite, deleteDream } from "../../services/dreamService";

// Backend'den gelen veri tipini tanımlıyorum
interface BackendDreamItem {
  id: number;
  title: string;
  content: string;
  category?: string;
  isFavorite?: boolean;
  interpretation?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

interface BackendResponse {
  success: boolean;
  count: number;
  data: BackendDreamItem[];
  message?: string;
}

// RootStackParamList tipini tanımlıyorum
type RootStackParamList = {
  RuyaYorumSonuc: {
    baslik: string;
    icerik: string;
    kategori: string;
    yorum?: string;
    tarih?: Date;
    fromSavedDream: boolean;
  };
  RuyaList: {
    showSearch?: boolean;
    showFilter?: boolean;
    toggleSearch?: boolean;
    toggleFilter?: boolean;
  };
};

// Navigation prop tipini tanımlıyorum
type RuyaListNavigationProp = StackNavigationProp<RootStackParamList, 'RuyaList'>;

interface RuyaListProps {
  route?: {
    params?: {
      showSearch?: boolean;
      showFilter?: boolean;
      toggleSearch?: boolean;
      toggleFilter?: boolean;
    };
  };
}

const RuyaList: React.FC<RuyaListProps> = ({ route }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ruyalar, setRuyalar] = useState<Ruya[]>([]);
  const [filteredRuyalar, setFilteredRuyalar] = useState<Ruya[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Yükleme durumu için yeni state
  const [error, setError] = useState<string | null>(null); // Hata durumu için yeni state
  const navigation = useNavigation<RuyaListNavigationProp>();
  const insets = useSafeAreaInsets();

  // Arka plan parlaklık efekti için değer
  const glowOpacity = useSharedValue(0.4);

  // Animasyonları başlat - parlaklık animasyonu
  useEffect(() => {
    glowOpacity.value = withTiming(0.7, { duration: 1500, easing: Easing.sin });
  }, []);

  // Parlaklık efekti için stil
  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  // Tüm benzersiz kategorileri rüyalardan çıkarma
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    // ruyalar undefined veya null ise boş dizi olarak işlem yap
    if (ruyalar && Array.isArray(ruyalar)) {
      ruyalar.forEach((ruya) => {
        if (ruya.kategori) {
          allCategories.add(ruya.kategori);
        }
      });
    }
    return Array.from(allCategories).sort();
  }, [ruyalar]);

  // Route params'dan gelen arama ve filtre durumunu kontrol et
  useFocusEffect(
    useCallback(() => {
      // Toggle parametreleri için kontrol ekliyoruz
      if (route?.params?.toggleSearch) {
        // Arama ikonuna tıklandığında arama çubuğunu toggle et
        setSearchVisible((prev) => !prev);
        if (filterVisible) setFilterVisible(false); // Arama açılırsa filtreyi kapat

        // Parametreyi sıfırlama
        navigation.setParams({ toggleSearch: undefined });
      }

      if (route?.params?.toggleFilter) {
        // Filtre ikonuna tıklandığında filtre çubuğunu toggle et
        setFilterVisible((prev) => !prev);
        if (searchVisible) setSearchVisible(false); // Filtre açılırsa aramayı kapat

        // Parametreyi sıfırlama
        navigation.setParams({ toggleFilter: undefined });
      }

      // Eski parametreler için uyumluluk
      if (route?.params?.showSearch) {
        setSearchVisible(true);
        setFilterVisible(false); // Arama açılınca filtre kapansın
        navigation.setParams({ showSearch: undefined });
      }

      if (route?.params?.showFilter) {
        setFilterVisible(true);
        setSearchVisible(false); // Filtre açılınca arama kapansın
        navigation.setParams({ showFilter: undefined });
      }
    }, [route?.params, navigation])
  );

  // Arama metni, favori filtreleme veya kategori değiştiğinde filtreleme yap
  useEffect(() => {
    // ruyalar undefined veya null ise işlem yapma
    if (!ruyalar || !Array.isArray(ruyalar)) {
      setFilteredRuyalar([]);
      return;
    }
    
    let filtered = ruyalar;

    // Önce metin araması yap
    if (searchText.trim() !== "") {
      filtered = filtered.filter((ruya) =>
        ruya.baslik.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sonra favorilere göre filtrele
    if (showFavorites) {
      filtered = filtered.filter((ruya) => ruya.isFavorite);
    }

    // Seçili kategoriler varsa, onlara göre filtrele
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ruya) =>
        selectedCategories.includes(ruya.kategori)
      );
    }

    setFilteredRuyalar(filtered);
  }, [searchText, ruyalar, showFavorites, selectedCategories]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleCloseSearch = () => {
    setSearchVisible(false);
    setSearchText("");
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setFilterVisible(false); // Filtre çubuğunu kapat

    // Favori durumu değişikliği hakkında bilgi ver
    ToastManager.show({
      message: !showFavorites
        ? "Sadece favori rüyalar gösteriliyor"
        : "Tüm rüyalar gösteriliyor",
      type: "info",
      duration: 2000,
      position: "top",
      icon: !showFavorites ? "star" : "list",
      iconColor: !showFavorites ? "#FF6B6B" : undefined,
    });
  };

  // Kategori seçme/kaldırma işlemi
  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Kategori zaten seçiliyse, kaldır
        return prev.filter((c) => c !== category);
      } else {
        // Kategori seçili değilse, ekle
        return [...prev, category];
      }
    });

    // Kategori seçildikten sonra filtre çubuğunu kapat
    setFilterVisible(false);

    // Kategori seçildi bilgisi ver
    ToastManager.show({
      message: "Kategori filtresi uygulandı",
      type: "info",
      duration: 2000,
      position: "top",
      icon: "filter",
    });
  };

  // Filtre temizleme
  const handleClearFilters = () => {
    setShowFavorites(false);
    setSelectedCategories([]);

    // Bilgi mesajı gösteriyoruz
    ToastManager.show({
      message: "Tüm filtreler temizlendi",
      type: "info",
      duration: 2000,
      position: "top",
      icon: "checkmark-circle",
    });
  };

  const handleCloseFilter = () => {
    setFilterVisible(false);
  };

  // Backend'den rüyaları çekme fonksiyonu
  const fetchRuyalar = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserDreams() as BackendResponse;
      
      // Backend'den gelen veri kontrolü
      // Backend'den gelen veri bir nesne içinde data dizisi olarak geliyor
      if (response && typeof response === 'object') {
        // Eğer response.data bir dizi ise
        if (response.data && Array.isArray(response.data)) {
          // Backend'den gelen veriyi Ruya modeline uygun şekilde dönüştür
          const formattedData: Ruya[] = response.data.map((item: BackendDreamItem) => ({
            id: item.id.toString(),
            baslik: item.title,
            icerik: item.content,
            kategori: item.category || "Genel",
            isFavorite: item.isFavorite || false,
            yorum: item.interpretation,
            tarih: item.createdAt ? new Date(item.createdAt) : undefined
          }));
          
          setRuyalar(formattedData);
          setFilteredRuyalar(formattedData);
        } else if (response.success === false) {
          // API başarısız oldu
          console.error("Backend API hatası:", response);
          setRuyalar([]);
          setFilteredRuyalar([]);
          setError("Rüya verileri alınamadı. Lütfen tekrar deneyin.");
        } else {
          // Veri formatı beklenen gibi değil
          console.error("Backend'den gelen veri formatı uygun değil:", response);
          setRuyalar([]);
          setFilteredRuyalar([]);
          setError("Veri formatı uygun değil. Lütfen tekrar deneyin.");
        }
      } else {
        // Eğer veri array değilse boş array olarak ayarla
        console.error("Backend'den gelen veri uygun formatta değil:", response);
        setRuyalar([]);
        setFilteredRuyalar([]);
        setError("Rüya verileri uygun formatta değil. Lütfen tekrar deneyin.");
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Rüyalar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      // Hata durumunda boş array olarak ayarla
      setRuyalar([]);
      setFilteredRuyalar([]);
      
      ToastManager.show({
        message: "Rüyalar yüklenirken bir hata oluştu",
        type: "error",
        duration: 3000,
        position: "top",
        icon: "alert-circle",
      });
      console.error("Rüyalar yüklenirken hata:", err);
    }
  };

  // Sayfa yüklendiğinde ve her odaklandığında rüyaları çek
  useFocusEffect(
    useCallback(() => {
      fetchRuyalar();
    }, [])
  );

  // Favori durumunu değiştirme fonksiyonu - backend entegrasyonu ile
  const handleFavoriteToggle = async (id: string) => {
    try {
      // ruyalar undefined veya null ise işlem yapma
      if (!ruyalar || !Array.isArray(ruyalar)) {
        ToastManager.show({
          message: "Rüya verileri yüklenemedi, lütfen sayfayı yenileyin",
          type: "error",
          duration: 3000,
          position: "top",
          icon: "alert-circle",
        });
        return;
      }
      
      // Önce UI'ı güncelle (optimistik güncelleme)
      const currentRuya = ruyalar.find(ruya => ruya.id === id);
      if (!currentRuya) return;
      
      const newFavoriteStatus = !currentRuya.isFavorite;
      
      // UI'ı hemen güncelle
      const updatedRuyalar = ruyalar.map((ruya) =>
        ruya.id === id ? { ...ruya, isFavorite: newFavoriteStatus } : ruya
      );
      setRuyalar(updatedRuyalar);
      
      // Backend'e güncelleme gönder - id'yi number'a çevir
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Geçersiz rüya ID'si");
      }
      
      await toggleFavorite(numericId, newFavoriteStatus);
      
      // Başarılı mesajı göster
      ToastManager.show({
        message: newFavoriteStatus 
          ? "Rüya favorilere eklendi" 
          : "Rüya favorilerden çıkarıldı",
        type: "success",
        duration: 2000,
        position: "top",
        icon: newFavoriteStatus ? "star" : "star-outline",
      });
    } catch (err) {
      // Hata durumunda UI'ı eski haline getir
      fetchRuyalar(); // Verileri yeniden çek
      
      ToastManager.show({
        message: "Favori durumu güncellenirken bir hata oluştu",
        type: "error",
        duration: 3000,
        position: "top",
        icon: "alert-circle",
      });
      console.error("Favori durumu güncellenirken hata:", err);
    }
  };

  // Rüyayı silme işlemi için fonksiyon - backend entegrasyonu ile
  const handleDeleteRuya = async (id: string) => {
    try {
      // ruyalar undefined veya null ise işlem yapma
      if (!ruyalar || !Array.isArray(ruyalar)) {
        ToastManager.show({
          message: "Rüya verileri yüklenemedi, lütfen sayfayı yenileyin",
          type: "error",
          duration: 3000,
          position: "top",
          icon: "alert-circle",
        });
        return;
      }
      
      // Önce UI'ı güncelle (optimistik silme)
      const updatedRuyalar = ruyalar.filter((ruya) => ruya.id !== id);
      setRuyalar(updatedRuyalar);
      setFilteredRuyalar((prev) => {
        if (!prev || !Array.isArray(prev)) return [];
        return prev.filter((ruya) => ruya.id !== id);
      });
      
      // Backend'den sil - id'yi number'a çevir
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Geçersiz rüya ID'si");
      }
      
      await deleteDream(numericId);
      
      // Başarılı mesajı göster
      ToastManager.show({
        message: "Rüya başarıyla silindi",
        type: "success",
        duration: 2000,
        position: "top",
        icon: "trash",
      });
    } catch (err) {
      // Hata durumunda UI'ı eski haline getir
      fetchRuyalar(); // Verileri yeniden çek
      
      ToastManager.show({
        message: "Rüya silinirken bir hata oluştu",
        type: "error",
        duration: 3000,
        position: "top",
        icon: "alert-circle",
      });
      console.error("Rüya silinirken hata:", err);
    }
  };

  // Yenileme işlemini gerçekleştiren fonksiyon - backend entegrasyonu ile
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRuyalar().finally(() => {
      setRefreshing(false);
    });
  }, []);

  // Rüya yorumunu görüntülemek için fonksiyon
  const handleViewInterpretation = (ruya: Ruya) => {
    // Rüya yorumunun bulunduğu RüyaYorumSonuc ekranına yönlendirelim
    navigation.navigate("RuyaYorumSonuc", {
      baslik: ruya.baslik,
      icerik: ruya.icerik,
      kategori: ruya.kategori,
      yorum: ruya.yorum,
      tarih: ruya.tarih,
      fromSavedDream: true, // Bu parametre ile kayıtlı bir rüyadan geldiğini belirtelim
    });
  };

  const renderRuyaItem = ({ item }: { item: Ruya }) => {
    // item undefined veya null ise boş bir view döndür
    if (!item) {
      return <View />;
    }
    
    return (
      <RuyaCard
        ruya={item}
        onFavoriteToggle={handleFavoriteToggle}
        onDelete={handleDeleteRuya} // Silme fonksiyonunu prop olarak geçiriyoruz
        onViewInterpretation={handleViewInterpretation} // Yorum görüntüleme fonksiyonunu prop olarak geçiriyoruz
      />
    );
  };

  // Dinamik padding hesaplama
  const headerHeight = hp("8%");
  const topPadding = insets.top + headerHeight;
  const bottomPadding = insets.bottom + hp("10%");

  // Filtreleme durumunu kontrol et
  const hasActiveFilters = showFavorites || selectedCategories.length > 0;

  // Arama veya filtre görünür olduğunda ek padding hesaplaması
  const additionalPadding = searchVisible || filterVisible ? hp("8.5%") : 0;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left"]}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#1A1A40", "#2C2C6C", "#4B0082"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Parlaklık efekti için iç içe gradient */}
        <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
          <LinearGradient
            colors={["rgba(255,255,255,0.1)", "rgba(75, 0, 130, 0.4)"]}
            style={styles.glowGradient}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <View style={styles.container}>
          {/* Arama çubuğu */}
          <SearchBar
            visible={searchVisible}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />

          {/* Filtre çubuğu - Kategori desteği eklenmiş */}
          <FilterBar
            visible={filterVisible}
            onClose={handleCloseFilter}
            showFavorites={showFavorites}
            onToggleFavorites={handleToggleFavorites}
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
          />

          {/* Aktif filtre göstergesi */}
          {hasActiveFilters && !filterVisible && (
            <View
              style={[
                styles.activeFiltersContainer,
                {
                  top:
                    topPadding +
                    (additionalPadding > 6 ? additionalPadding : 6),
                },
              ]}
            >
              <Text style={styles.activeFiltersText}>
                Aktif Filtreler:
                {showFavorites ? " Favoriler" : ""}
                {selectedCategories.length > 0
                  ? ` ${selectedCategories.length} Kategori`
                  : ""}
              </Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearFiltersText}>Temizle</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Yükleme göstergesi */}
          {loading && !refreshing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Rüyalar yükleniyor...</Text>
            </View>
          )}

          {/* Hata mesajı */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={50} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchRuyalar}
              >
                <Text style={styles.retryButtonText}>Tekrar Dene</Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            data={filteredRuyalar || []}
            keyExtractor={(item) => item.id}
            renderItem={renderRuyaItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !loading && !error ? (
                <View style={styles.emptyStateContainer}>
                  <Ionicons
                    name={showFavorites ? "star" : "search"}
                    size={50}
                    color="rgba(255, 255, 255, 0.8)"
                    style={styles.emptyStateIcon}
                  />
                  <Text style={styles.emptyStateText}>
                    {showFavorites
                      ? "Henüz favori rüyanız yok"
                      : selectedCategories.length > 0
                      ? "Seçili kategorilerde rüya bulunamadı"
                      : "Rüya bulunamadı"}
                  </Text>
                  <Text style={styles.emptyStateSubText}>
                    {showFavorites
                      ? "Favori rüyalarınız burada görünecek"
                      : selectedCategories.length > 0
                      ? "Farklı bir kategori seçmeyi deneyin"
                      : "Yeni bir rüya eklemek için 'Rüya Bak' ekranına gidin"}
                  </Text>
                </View>
              ) : null
            }
            contentContainerStyle={{
              paddingTop:
                topPadding +
                additionalPadding +
                (hasActiveFilters ? hp("5%") : 0), // Aktif filtreler varsa ekstra alan bırakıyoruz
              paddingBottom: bottomPadding,
              flexGrow: 1,
            }}
            // RefreshControl bileşenini ekleyelim
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4B0082"]}
                tintColor="#4B0082"
                title="Yenileniyor..."
                titleColor="#4B0082"
                progressBackgroundColor="#FFFFFF"
                progressViewOffset={topPadding + hp("2%")}
              />
            }
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RuyaList;
