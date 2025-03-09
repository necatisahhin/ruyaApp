import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styles from "./RuyaListStyles";
import { dummyRuyalar } from "../../data/dummyRuyalar";
import { Ruya } from "../../models/RuyaModel";
import RuyaCard from "../../components/RuyaCard/RuyaCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import EmptyStateMessage from "../../components/EmptyStateMessage/EmptyStateMessage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
  const [ruyalar, setRuyalar] = useState<Ruya[]>(dummyRuyalar);
  const [filteredRuyalar, setFilteredRuyalar] = useState<Ruya[]>(dummyRuyalar);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
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
    ruyalar.forEach((ruya) => {
      if (ruya.kategori) {
        allCategories.add(ruya.kategori);
      }
    });
    return Array.from(allCategories).sort();
  }, [ruyalar]);

  // Route params'dan gelen arama ve filtre durumunu kontrol et
  useFocusEffect(
    useCallback(() => {
      // Bir doğrulama log'u ekleyerek parametreleri görelim
      console.log("RuyaList params:", route?.params);

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

  // Favori durumunu değiştirme fonksiyonu
  const handleFavoriteToggle = (id: string) => {
    // Rüyaların kopyasını oluşturuyoruz
    const updatedRuyalar = ruyalar.map((ruya) =>
      ruya.id === id ? { ...ruya, isFavorite: !ruya.isFavorite } : ruya
    );

    // State'i güncelliyoruz
    setRuyalar(updatedRuyalar);
  };

  // Rüyayı silme işlemi için fonksiyon
  const handleDeleteRuya = (id: string) => {
    // Silinecek rüyayı dışarıda bırakarak yeni bir dizi oluştur
    const updatedRuyalar = ruyalar.filter((ruya) => ruya.id !== id);

    // State'i güncelle
    setRuyalar(updatedRuyalar);

    // Eğer silinen rüya filtrelenmiş rüyalar listesinde ise onu da güncelle
    setFilteredRuyalar((prev) => prev.filter((ruya) => ruya.id !== id));
  };

  // Yenileme işlemini gerçekleştiren fonksiyon
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Yenileme durumunu aktif et

    // Gerçek bir uygulamada burada API çağrısı yapılabilir
    setTimeout(() => {
      // Yenileme yapıldığını göstermek için mevcut listeyi koruyoruz
      // Gerçek bir uygulamada burada veritabanından veya API'den veriler çekilir
      setRuyalar([...ruyalar]); // Aynı listeyi kullanarak state'i güncelliyoruz
      setRefreshing(false); // Yenileme durumunu kapat
    }, 1500); // 1.5 saniye sonra yenilemeyi tamamla (örnek süre)
  }, [ruyalar]);

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
        colors={["#614385", "#516395", "#A979AA"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Parlaklık efekti için iç içe gradient */}
        <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
          <LinearGradient
            colors={["rgba(255,255,255,0.1)", "rgba(106, 53, 107, 0.4)"]}
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

          <FlatList
            data={filteredRuyalar}
            keyExtractor={(item) => item.id}
            renderItem={renderRuyaItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyStateMessage
                showFavorites={showFavorites}
                customMessage={
                  selectedCategories.length > 0
                    ? "Seçili kategorilerde rüya bulunamadı"
                    : undefined
                }
              />
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
                colors={["#6A356B"]}
                tintColor="#6A356B"
                title="Yenileniyor..."
                titleColor="#6A356B"
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
