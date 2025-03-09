import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
  withDelay,
  FadeIn,
  FadeInDown,
  SlideInDown,
} from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import styles from "./RuyaYorumSonucStyles";
import { ToastManager } from "../../utils/ToastManager";
import { Ruya } from "../../models/RuyaModel";
import { dummyRuyalar } from "../../data/dummyRuyalar";

// UUID kütüphanesi olmadığı için benzersiz ID üretecek basit bir fonksiyon
const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Route parametre tiplerini tanımlayalım
interface RouteParams {
  baslik: string;
  icerik: string;
  kategori: string;
  yorum: string;
  tarih: Date;
  fromSavedDream?: boolean; // Kayıtlı rüyadan geliyorsa true olacak yeni parametre
}

const RuyaYorumSonucScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Route parametrelerine tiplerini uygulayalım
  const { baslik, icerik, kategori, yorum, tarih, fromSavedDream } =
    route.params as RouteParams;

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Glow efekti için animasyon değeri
  const glowOpacity = useSharedValue(0.6);

  // Animasyon efekti için
  useEffect(() => {
    // Glow efekti animasyonu
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.sin }),
        withTiming(0.5, { duration: 2000, easing: Easing.sin })
      ),
      -1,
      true
    );
  }, []);

  // Glow animasyon stili
  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  // Tarih formatı için yardımcı fonksiyon
  const formatTarih = (tarih: Date): string => {
    if (typeof tarih === "string") return tarih;

    return tarih.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Rüyayı kaydetme işlevi
  const handleSaveToMyDreams = () => {
    setIsLoading(true);

    // Yeni rüya objesi oluştur
    const newDream: Ruya = {
      id: generateUniqueId(),
      baslik: baslik,
      icerik: icerik,
      kategori: kategori,
      tarih: new Date(),
      isFavorite: false,
      yorum: yorum,
    };

    // Simüle edilmiş asenkron kaydetme işlemi
    setTimeout(() => {
      try {
        dummyRuyalar.unshift(newDream);
        setIsSaved(true);
        setIsLoading(false);

        ToastManager.show({
          message: "Rüyanız başarıyla kaydedildi!",
          type: "success",
          position: "top",
          duration: 3000,
          icon: "checkmark-circle",
          iconColor: "#4CAF50",
        });
      } catch (error) {
        setIsLoading(false);
        ToastManager.show({
          message: "Rüya kaydedilirken bir hata oluştu.",
          type: "error",
          position: "top",
          duration: 3000,
          icon: "alert-circle",
          iconColor: "#FF5252",
        });
      }
    }, 1000);
  };

  // Paylaşma işlevi
  const handleShareDream = async () => {
    try {
      const shareMessage = `Rüya Yorumu: ${baslik}\n\n${yorum}\n\nEl Emeği Rüya Yorumlama uygulaması ile yorumlandı.`;

      await Share.share({
        message: shareMessage,
        title: `Rüya Yorumu: ${baslik}`,
      });
    } catch (error) {
      ToastManager.show({
        message: "Paylaşım sırasında bir hata oluştu.",
        type: "error",
        position: "top",
        duration: 2000,
        icon: "alert-circle",
        iconColor: "#FF5252",
      });
    }
  };

  // Geri buton işleyicisi
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Rüyalarım sayfasına git
  const handleGoToMyDreams = () => {
    // İç içe geçmiş navigatörlerde doğru yönlendirme yapısı
    navigation.navigate("TabNavigator", {
      screen: "RuyaList",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1E1A33"
        translucent={true}
      />

      {/* Ana Arka Plan */}
      <LinearGradient
        colors={["#1E1A33", "#36287E", "#4A246D"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glow Efekti */}
      <Animated.View style={[styles.glowEffect, glowAnimatedStyle]}>
        <LinearGradient
          colors={[
            "rgba(255, 183, 77, 0)",
            "rgba(255, 183, 77, 0.3)",
            "rgba(255, 183, 77, 0)",
          ]}
          style={{ width: "100%", height: "100%", borderRadius: 300 }}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Geri Butonu */}
      <Animated.View
        entering={FadeIn.delay(200).duration(500)}
        style={styles.backButtonContainer}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // Dokunma alanını genişletiyoruz
        >
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back" size={24} color="#1E1A33" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Başlık Bölümü */}
        <Animated.View
          style={styles.headerSection}
          entering={FadeInDown.delay(300).duration(800).springify()}
        >
          <Text style={styles.titleText}>{baslik}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{kategori}</Text>
            </View>
            <View style={styles.dateChip}>
              <Text style={styles.dateText}>{formatTarih(tarih)}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Rüya İçerik Bölümü */}
        <Animated.View
          style={styles.contentSection}
          entering={FadeInDown.delay(500).duration(800).springify()}
        >
          <Text style={styles.sectionTitle}>Rüya Anlatımı</Text>
          <LinearGradient
            colors={["rgba(74, 36, 109, 0.4)", "rgba(54, 40, 126, 0.4)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dreamContent}
          >
            <Text style={styles.contentText}>{icerik}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Yorum Bölümü */}
        <Animated.View
          style={styles.interpretationSection}
          entering={FadeInDown.delay(700).duration(800).springify()}
        >
          <Text style={styles.sectionTitle}>İslami Rüya Yorumu</Text>
          <LinearGradient
            colors={["rgba(74, 36, 109, 0.4)", "rgba(54, 40, 126, 0.4)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.interpretationContent}
          >
            <Text style={styles.interpretationText}>{yorum}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Butonlar */}
        <Animated.View
          style={styles.actionButtonsContainer}
          entering={SlideInDown.delay(900).duration(800).springify()}
        >
          {/* Eğer kayıtlı bir rüyadan geliyorsa kaydetme butonu gösterme */}
          {!fromSavedDream ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveToMyDreams}
              style={styles.actionButton}
              disabled={isSaved || isLoading}
            >
              <LinearGradient
                colors={
                  isSaved ? ["#4CAF50", "#2E7D32"] : ["#9C27B0", "#6A1B9A"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonContent}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Kaydediliyor...</Text>
                  </View>
                ) : (
                  <>
                    <Ionicons
                      name={isSaved ? "checkmark-circle" : "save-outline"}
                      size={22}
                      color="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>
                      {isSaved ? "Rüyanız Kaydedildi" : "Rüyalarıma Kaydet"}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            // Kayıtlı rüyadan geliyorsa geri dön butonu göster
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoBack}
              style={styles.actionButton}
            >
              <LinearGradient
                colors={["#607D8B", "#455A64"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonContent}
              >
                <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                <Text style={styles.buttonText}>Geri Dön</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Paylaş Butonu */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleShareDream}
            style={styles.actionButton}
          >
            <LinearGradient
              colors={["#2196F3", "#0D47A1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonContent}
            >
              <Ionicons name="share-social-outline" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>Yorumu Paylaş</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Rüyalarıma Git Butonu - Sadece kaydedilmişse ve kayıtlı rüyadan gelmiyorsa göster */}
          {isSaved && !fromSavedDream && (
            <Animated.View
              entering={FadeIn.delay(300).duration(500)}
              style={styles.actionButton}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoToMyDreams}
                style={{ width: "100%", height: "100%" }}
              >
                <LinearGradient
                  colors={["#FF5722", "#E64A19"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonContent}
                >
                  <Ionicons name="list-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Rüyalarıma Git</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RuyaYorumSonucScreen;
