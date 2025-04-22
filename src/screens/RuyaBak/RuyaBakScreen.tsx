import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import styles from "./RuyaBakStyles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import { ToastManager } from "../../utils/ToastManager";
import { interpretDream } from "../../services/openRouterService";
import { useNavigation } from "@react-navigation/native";
import { getUserProfile } from "../../services/authService";

// Düşük performanslı cihazlar için animasyon iyileştirmeleri
const LOW_PERFORMANCE_MODE = Platform.OS === 'android' && Platform.Version < 26;
const DISABLE_ANIMATIONS = false; // İsteğe bağlı olarak tamamen kapatmak için

const RuyaBak = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State'ler
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [userProfile, setUserProfile] = useState<{
    age?: number;
    gender?: string;
    maritalStatus?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Animasyon değerleri
  const moonRotation = useSharedValue(0);
  const moonScale = useSharedValue(0.9);
  const moonY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);
  const glowScale = useSharedValue(1);
  
  // Yıldızlar için animasyon değerleri
  const starsOpacity = Array(12)
    .fill(0)
    .map(() => useSharedValue(0));
  const starsScale = Array(12)
    .fill(0)
    .map(() => useSharedValue(0.2));
    
  // Form animasyon değerleri
  const formScale = useSharedValue(0.9);
  const formOpacity = useSharedValue(0);
  const submitButtonScale = useSharedValue(1);
  const submitButtonRotate = useSharedValue(0);

  // Klavye durumunu takip et
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Kullanıcı profil bilgilerini yükle
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUserProfile({
          age: userData.age || 0,
          gender: userData.gender || "",
          maritalStatus: userData.maritalStatus || "",
        });
      } catch (error) {
        console.error("Profil bilgileri yüklenirken hata:", error);
        // Hata durumunda sessizce devam et, profil bilgileri olmadan da rüya yorumlanabilir
      }
    };

    fetchUserProfile();
  }, []);

  // Animasyonları başlat
  useEffect(() => {
    // Düşük performans modunda veya animasyonlar devre dışı bırakıldıysa animasyonları azalt
    if (DISABLE_ANIMATIONS) {
      // Animasyonlar devre dışı - statik değerler kullan
      formOpacity.value = 1;
      formScale.value = 1;
      moonRotation.value = 0;
      moonScale.value = 1;
      moonY.value = 0;
      glowOpacity.value = 0.5;
      glowScale.value = 1;
      
      // Yıldızlara sabit değerler ata
      starsOpacity.forEach((opacity) => {
        opacity.value = 0.5;
      });
      starsScale.forEach((scale) => {
        scale.value = 0.8;
      });
      
      return;
    }
    
    // Form animasyonu
    formOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    formScale.value = withDelay(
      500,
      withTiming(1, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Düşük performans modunda daha hafif animasyonlar kullan
    if (LOW_PERFORMANCE_MODE) {
      // Ay dönüş animasyonu - daha da yavaş ve daha az yenilenen
      moonRotation.value = withRepeat(
        withTiming(360, { duration: 120000, easing: Easing.linear }),
        -1,
        false
      );
      
      // Diğer animasyonlar için basitleştirilmiş versiyonlar
      moonScale.value = 1;
      moonY.value = 0;
      glowOpacity.value = 0.5;
      glowScale.value = 1;
      
      // Yalnızca bir kaç yıldız için animasyon kullan
      const animatedStarCount = 3; // Çok az sayıda yıldız
      
      for (let i = 0; i < animatedStarCount; i++) {
        const index = i * 4; // Daha fazla boşluk bırak
        if (index < starsOpacity.length) {
          starsOpacity[index].value = withRepeat(
            withSequence(
              withTiming(0.8, { duration: 5000, easing: Easing.linear }),
              withTiming(0.3, { duration: 5000, easing: Easing.linear })
            ),
            -1,
            true
          );
          
          // Diğer tüm yıldızları statik tut
          starsScale.forEach((scale, i) => {
            scale.value = 0.8;
          });
        }
      }
      
      return;
    }

    // Normal mod - optimize edilmiş animasyonlar
    // Ay dönüş animasyonu - daha yavaş ve daha az performans gerektiren süre
    moonRotation.value = withRepeat(
      withTiming(360, { duration: 60000, easing: Easing.linear }),
      -1,
      false
    );

    // Ay boyut ve pozisyon animasyonu - süreyi uzatarak CPU kullanımını azaltma
    moonScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 5000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0.95, { duration: 5000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );
    
    moonY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 6000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(10, { duration: 6000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );

    // Parlaklık animasyonu - süreyi uzatarak CPU kullanımını azaltma
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 6000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0.3, { duration: 6000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );
    
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 7000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0.8, { duration: 7000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );

    // Yıldızlar için animasyonlar - daha az yoğun ve daha az sayıda animasyon
    // Yıldızların tamamı yerine sadece yarısını animasyonla hareket ettiriyoruz
    const maxStars = Math.floor(starsOpacity.length / 2);
    
    for (let i = 0; i < maxStars; i++) {
      // Sadece çift sayılı yıldızları canlandır
      const index = i * 2; 
      
      starsOpacity[index].value = withDelay(
        index * 600, // Delay süresini artırarak aynı anda daha az animasyon çalıştırma
        withRepeat(
          withSequence(
            withTiming(0.9, {
              duration: 3000 + index * 500,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            withTiming(0.2, {
              duration: 3000 + index * 500,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            })
          ),
          -1,
          true
        )
      );
      
      starsScale[index].value = withDelay(
        index * 600, // Delay süresini artırarak aynı anda daha az animasyon çalıştırma
        withRepeat(
          withSequence(
            withTiming(1, {
              duration: 3000 + index * 400,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            withTiming(0.6, {
              duration: 3000 + index * 400,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            })
          ),
          -1,
          true
        )
      );
      
      // Diğer yıldızlara sabit değerler ata
      if (index + 1 < starsOpacity.length) {
        starsOpacity[index + 1].value = 0.5;
        starsScale[index + 1].value = 0.8;
      }
    }
  }, []);

  // Animasyon stilleri
  const moonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${moonRotation.value}deg` },
        { scale: moonScale.value },
        { translateY: moonY.value },
      ],
    };
  });

  const moonGlowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      transform: [{ scale: glowScale.value }],
    };
  });

  // Form animasyon stilleri
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ scale: formScale.value }],
    };
  });

  const submitButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: submitButtonScale.value },
        { rotate: `${submitButtonRotate.value}deg` },
      ],
    };
  });

  // Yıldız pozisyonları
  const starPositions = [
    { top: hp("5%"), left: wp("15%") },
    { top: hp("8%"), right: wp("20%") },
    { top: hp("15%"), left: wp("25%") },
    { top: hp("12%"), right: wp("30%") },
    { top: hp("20%"), left: wp("10%") },
    { top: hp("18%"), right: wp("15%") },
    { top: hp("25%"), left: wp("30%") },
    { top: hp("22%"), right: wp("25%") },
    { top: hp("7%"), left: wp("40%") },
    { top: hp("14%"), right: wp("10%") },
    { top: hp("10%"), left: wp("60%") },
    { top: hp("23%"), right: wp("40%") },
  ];

  // Form gönderme fonksiyonu
  const handleSubmit = async () => {
    if (!title) {
      ToastManager.show({
        message: "Lütfen rüyanıza bir başlık ekleyin",
        type: "warning",
        position: "top",
        duration: 2000,
      });
      return;
    }

    if (!description) {
      ToastManager.show({
        message: "Lütfen rüyanızı tarif edin",
        type: "warning",
        position: "top",
        duration: 2000,
      });
      return;
    }

    // Buton animasyonu
    submitButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    submitButtonRotate.value = withSequence(
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    setIsLoading(true);
    setLoadingProgress(0);

    // İlerleme simülasyonu için zamanlayıcı
    const progressInterval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress < 95) {
          return prevProgress + Math.floor(Math.random() * 5) + 1;
        }
        return prevProgress;
      });
    }, 800);

    try {
      // Rüya yorumlama API'sine istek at
      const dreamInterpretation = await interpretDream(
        title,
        description,
        category,
        userProfile
      );

      // Zamanlayıcıyı temizle
      clearInterval(progressInterval);
      setLoadingProgress(100);

      // Yükleme durumunu kapat
      setIsLoading(false);

      // Sonuç sayfasına yönlendir
      navigation.navigate("RuyaYorumSonuc", {
        baslik: title,
        icerik: description,
        kategori: category || "Genel",
        yorum: dreamInterpretation,
        tarih: new Date(),
      });
    } catch (error) {
      // Zamanlayıcıyı temizle
      clearInterval(progressInterval);

      setIsLoading(false);
      ToastManager.show({
        message: error.message || "Rüya yorumlanırken bir hata oluştu.",
        type: "error",
        position: "top",
        duration: 3000,
        icon: "alert-circle",
        iconColor: "#FF5252",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left"]}>
      <LinearGradient
        colors={["#1A1A40", "#2C2C6C", "#4B0082"]}
        style={styles.backgroundImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingBottom: hp("10%"),
            paddingTop: insets.top,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            {/* Gökyüzü ve Ay Bölümü */}
            <View style={styles.headerContainer}>
              <View style={styles.moonSceneContainer}>
                {/* Ay parlaklık efekti */}
                <Animated.View style={[styles.moonGlow, moonGlowAnimatedStyle]} />
                
                {/* Animasyonlu ay ikonu */}
                <Animated.View style={[styles.moonContainer, moonAnimatedStyle]}>
                  <Ionicons
                    name="moon"
                    size={80}
                    color="rgba(255, 253, 225, 0.95)"
                  />
                </Animated.View>
                
                {/* Animasyonlu yıldızlar */}
                {starsOpacity.map((opacity, index) => {
                  const starAnimatedStyle = useAnimatedStyle(() => {
                    return {
                      opacity: starsOpacity[index].value,
                      transform: [{ scale: starsScale[index].value }],
                    };
                  });

                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.starContainer,
                        starPositions[index],
                        starAnimatedStyle,
                      ]}
                    >
                      <Ionicons
                        name={index % 3 === 0 ? "star" : index % 3 === 1 ? "sparkles" : "star-outline"}
                        size={index % 4 === 0 ? 24 : index % 4 === 1 ? 20 : index % 4 === 2 ? 16 : 22}
                        color="rgba(255, 253, 225, 0.95)"
                      />
                    </Animated.View>
                  );
                })}
              </View>
              
              {/* Başlık ve Alt Başlık */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Rüya Dünyasına Hoş Geldiniz</Text>
                <Text style={styles.subtitle}>
                  Rüyalarınızın derinliklerini keşfedin ve İslami yorumlarla anlamlarını öğrenin
                </Text>
              </View>
            </View>

            {/* Form Bölümü */}
            <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
              <LinearGradient
                colors={["rgba(75, 0, 130, 0.8)", "rgba(25, 25, 112, 0.9)"]}
                style={styles.formBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.formContent}>
                  {/* Başlık Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name="book-outline"
                        size={22}
                        color="#FFFFFF"
                        style={styles.inputIcon}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Rüya Başlığı"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={title}
                      onChangeText={setTitle}
                    />
                  </View>

                  {/* Açıklama Input */}
                  <View style={styles.textAreaContainer}>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name="create-outline"
                        size={22}
                        color="#FFFFFF"
                        style={styles.inputIcon}
                      />
                    </View>
                    <TextInput
                      style={styles.textArea}
                      placeholder="Rüyanızı detaylı bir şekilde anlatın..."
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={description}
                      onChangeText={setDescription}
                    />
                  </View>

                  {/* Kategori Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name="pricetag-outline"
                        size={22}
                        color="#FFFFFF"
                        style={styles.inputIcon}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Kategori (isteğe bağlı)"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={category}
                      onChangeText={setCategory}
                    />
                  </View>

                  {/* Gönder Butonu */}
                  <TouchableOpacity onPress={handleSubmit} disabled={isLoading}>
                    <Animated.View
                      style={[
                        styles.submitButtonContainer,
                        submitButtonAnimatedStyle,
                      ]}
                    >
                      <LinearGradient
                        colors={["#FF6B6B", "#FF8E53"]}
                        style={styles.submitButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        {isLoading ? (
                          <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text style={styles.loadingText}>
                              Rüyanız yorumlanıyor: %{loadingProgress}
                            </Text>
                          </View>
                        ) : (
                          <>
                            <View style={styles.buttonIconContainer}>
                              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                            </View>
                            <Text style={styles.submitButtonText}>
                              Rüyamı Yorumla
                            </Text>
                          </>
                        )}
                      </LinearGradient>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RuyaBak;
