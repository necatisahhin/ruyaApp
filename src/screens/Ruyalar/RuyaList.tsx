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

import { ToastManager } from "../../utils/ToastManager";
import { Ionicons } from "@expo/vector-icons"; 
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { getUserDreams, toggleFavorite, deleteDream } from "../../services/dreamService";


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
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const navigation = useNavigation<RuyaListNavigationProp>();
  const insets = useSafeAreaInsets();

  
  const glowOpacity = useSharedValue(0.4);

  
  useEffect(() => {
    glowOpacity.value = withTiming(0.7, { duration: 1500, easing: Easing.sin });
  }, []);

  
  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    
    if (ruyalar && Array.isArray(ruyalar)) {
      ruyalar.forEach((ruya) => {
        if (ruya.kategori) {
          allCategories.add(ruya.kategori);
        }
      });
    }
    return Array.from(allCategories).sort();
  }, [ruyalar]);

  
  useFocusEffect(
    useCallback(() => {
      
      
      if (route?.params?.toggleSearch) {
        
        
        setFilterVisible(false);
        setSearchVisible(true);
        
        
        navigation.setParams({ toggleSearch: undefined });
        return;
      }

      if (route?.params?.toggleFilter) {
        
        
        setSearchVisible(false);
        setFilterVisible(true);
        
        
        navigation.setParams({ toggleFilter: undefined });
        return;
      }

      
      if (route?.params?.showSearch) {
        setSearchVisible(true);
        setFilterVisible(false); 
        navigation.setParams({ showSearch: undefined });
      }

      if (route?.params?.showFilter) {
        setFilterVisible(true);
        setSearchVisible(false); 
        navigation.setParams({ showFilter: undefined });
      }
    }, [route?.params, navigation])
  );

  
  useEffect(() => {
    
    if (!ruyalar || !Array.isArray(ruyalar)) {
      setFilteredRuyalar([]);
      return;
    }
    
    let filtered = ruyalar;

    
    if (searchText.trim() !== "") {
      filtered = filtered.filter((ruya) =>
        ruya.baslik.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    
    if (showFavorites) {
      filtered = filtered.filter((ruya) => ruya.isFavorite);
    }

    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ruya) =>
        selectedCategories.includes(ruya.kategori)
      );
    }

    setFilteredRuyalar(filtered);
  }, [searchText, ruyalar, showFavorites, selectedCategories]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    
    
    if (!ruyalar || !Array.isArray(ruyalar)) {
      setFilteredRuyalar([]);
      return;
    }
    
    
    let filtered = [...ruyalar];
    
    if (text.trim() !== "") {
      filtered = filtered.filter((ruya) =>
        ruya.baslik.toLowerCase().includes(text.toLowerCase())
      );
    }
    
    
    if (showFavorites) {
      filtered = filtered.filter((ruya) => ruya.isFavorite);
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ruya) =>
        selectedCategories.includes(ruya.kategori)
      );
    }
    
    setFilteredRuyalar(filtered);
  };

  const handleCloseSearch = () => {
    setSearchVisible(false);
    setSearchText("");
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setFilterVisible(false); 

    
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

  
  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        
        return prev.filter((c) => c !== category);
      } else {
        
        return [...prev, category];
      }
    });

    
    setFilterVisible(false);

    
    ToastManager.show({
      message: "Kategori filtresi uygulandı",
      type: "info",
      duration: 2000,
      position: "top",
      icon: "filter",
    });
  };

  
  const handleClearFilters = () => {
    setShowFavorites(false);
    setSelectedCategories([]);

    
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

  
  const fetchRuyalar = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserDreams() as BackendResponse;
      
      
      
      if (response && typeof response === 'object') {
        
        if (response.data && Array.isArray(response.data)) {
          
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
          
          console.error("Backend API hatası:", response);
          setRuyalar([]);
          setFilteredRuyalar([]);
          setError("Rüya verileri alınamadı. Lütfen tekrar deneyin.");
        } else {
          
          console.error("Backend'den gelen veri formatı uygun değil:", response);
          setRuyalar([]);
          setFilteredRuyalar([]);
          setError("Veri formatı uygun değil. Lütfen tekrar deneyin.");
        }
      } else {
        
        console.error("Backend'den gelen veri uygun formatta değil:", response);
        setRuyalar([]);
        setFilteredRuyalar([]);
        setError("Rüya verileri uygun formatta değil. Lütfen tekrar deneyin.");
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Rüyalar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      
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

  
  useFocusEffect(
    useCallback(() => {
      fetchRuyalar();
    }, [])
  );

  
  const handleFavoriteToggle = async (id: string) => {
    try {
      
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
      
      
      const currentRuya = ruyalar.find(ruya => ruya.id === id);
      if (!currentRuya) return;
      
      const newFavoriteStatus = !currentRuya.isFavorite;
      
      
      const updatedRuyalar = ruyalar.map((ruya) =>
        ruya.id === id ? { ...ruya, isFavorite: newFavoriteStatus } : ruya
      );
      setRuyalar(updatedRuyalar);
      
      
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Geçersiz rüya ID'si");
      }
      
      await toggleFavorite(numericId, newFavoriteStatus);
      
      
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
      
      fetchRuyalar(); 
      
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

  
  const handleDeleteRuya = async (id: string) => {
    try {
      
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
      
      
      const updatedRuyalar = ruyalar.filter((ruya) => ruya.id !== id);
      setRuyalar(updatedRuyalar);
      setFilteredRuyalar((prev) => {
        if (!prev || !Array.isArray(prev)) return [];
        return prev.filter((ruya) => ruya.id !== id);
      });
      
      
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Geçersiz rüya ID'si");
      }
      
      await deleteDream(numericId);
      
      
      ToastManager.show({
        message: "Rüya başarıyla silindi",
        type: "success",
        duration: 2000,
        position: "top",
        icon: "trash",
      });
    } catch (err) {
      
      fetchRuyalar(); 
      
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

  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRuyalar().finally(() => {
      setRefreshing(false);
    });
  }, []);

  
  const handleViewInterpretation = (ruya: Ruya) => {
    
    navigation.navigate("RuyaYorumSonuc", {
      baslik: ruya.baslik,
      icerik: ruya.icerik,
      kategori: ruya.kategori,
      yorum: ruya.yorum,
      tarih: ruya.tarih,
      fromSavedDream: true, 
    });
  };

  const renderRuyaItem = ({ item }: { item: Ruya }) => {
    
    if (!item) {
      return <View />;
    }
    
    return (
      <RuyaCard
        ruya={item}
        onFavoriteToggle={handleFavoriteToggle}
        onDelete={handleDeleteRuya} 
        onViewInterpretation={handleViewInterpretation} 
      />
    );
  };

  
  const headerHeight = hp("8%");
  const topPadding = insets.top + headerHeight;
  const bottomPadding = insets.bottom + hp("10%");

  
  const hasActiveFilters = showFavorites || selectedCategories.length > 0;

  
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
                (hasActiveFilters ? hp("5%") : 0), 
              paddingBottom: bottomPadding,
              flexGrow: 1,
            }}
            
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
