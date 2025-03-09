import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ActivityIndicator,
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

const RuyaBak = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State'ler
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // İlerleme yüzdesi için yeni state

  // Header yüksekliği için dinamik hesaplama
  const headerHeight = hp("8%");
  const topPadding = insets.top;

  // Animasyon değerleri
  const moonRotation = useSharedValue(0);
  const moonScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.4);
  const starsOpacity = Array(5)
    .fill(0)
    .map(() => useSharedValue(0));
  const starsScale = Array(5)
    .fill(0)
    .map(() => useSharedValue(0.2));

  // Form animasyon değerleri
  const inputScale = useSharedValue(0.8);
  const inputOpacity = useSharedValue(0);
  const submitButtonScale = useSharedValue(1);
  const submitButtonRotate = useSharedValue(0);
  const formHeight = useSharedValue(0);

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

  // Animasyonları başlat
  useEffect(() => {
    // Form animasyonu
    formHeight.value = withTiming(hp("50%"), {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    inputOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    inputScale.value = withDelay(
      300,
      withTiming(1, {
        duration: 600,
        easing: Easing.bounce,
      })
    );

    // Ay dönüş animasyonu
    moonRotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1, // Sonsuz tekrar
      false
    );

    // Ay boyut animasyonu - Düzeltildi: inOut yerine doğrudan easing kullanımı
    moonScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.quad }),
        withTiming(0.95, { duration: 2000, easing: Easing.quad })
      ),
      -1,
      true
    );

    // Parlaklık animasyonu - Düzeltildi: inOut yerine doğrudan easing kullanımı
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 3000, easing: Easing.sin }),
        withTiming(0.4, { duration: 3000, easing: Easing.sin })
      ),
      -1,
      true
    );

    // Yıldızlar için animasyonlar
    starsOpacity.forEach((opacity, index) => {
      opacity.value = withDelay(
        index * 400,
        withRepeat(
          withSequence(
            withTiming(0.9, {
              duration: 1000 + index * 500,
              easing: Easing.ease,
            }),
            withTiming(0.2, {
              duration: 1200 + index * 500,
              easing: Easing.ease,
            })
          ),
          -1,
          true
        )
      );
    });

    starsScale.forEach((scale, index) => {
      scale.value = withDelay(
        index * 400,
        withRepeat(
          withSequence(
            withTiming(1, {
              duration: 1200 + index * 400,
              easing: Easing.bounce,
            }),
            withTiming(0.6, {
              duration: 1400 + index * 400,
              easing: Easing.bounce,
            })
          ),
          -1,
          true
        )
      );
    });
  }, []);

  // Animasyon stilleri
  const moonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${moonRotation.value}deg` },
        { scale: moonScale.value },
      ],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  // Form animasyon stilleri
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: formHeight.value,
    };
  });

  const inputAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: inputOpacity.value,
      transform: [{ scale: inputScale.value }],
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

  // Yıldız pozisyonları - rastgele konumlar
  const starPositions = [
    { top: "15%", left: "20%" },
    { top: "25%", right: "15%" },
    { top: "40%", left: "15%" },
    { top: "30%", right: "30%" },
    { top: "20%", left: "40%" },
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
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    setIsLoading(true);
    setLoadingProgress(0); // İlerleme yüzdesini sıfırla

    // İlerleme simülasyonu için zamanlayıcı
    const progressInterval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        // Maksimum %95'e kadar gitsin, gerçek sonuç gelince %100 olacak
        if (prevProgress < 95) {
          return prevProgress + Math.floor(Math.random() * 5) + 1;
        }
        return prevProgress;
      });
    }, 800); // Her 800ms'de bir güncelle

    try {
      // Rüya yorumlama API'sine istek at
      const dreamInterpretation = await interpretDream(
        title,
        description,
        category
      );

      // Zamanlayıcıyı temizle
      clearInterval(progressInterval);
      setLoadingProgress(100); // %100 ilerleme göster

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
    } catch (error: any) {
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#A979AA" }}
      edges={["right", "left"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: hp("15%") }} // Ekstra padding ekleyerek daha fazla kaydırma sağlandı
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { paddingTop: topPadding }]}>
          <View
            style={[
              styles.firstContainer,
              { height: keyboardVisible ? hp("30%") : hp("50%") },
            ]}
          >
            <LinearGradient
              colors={["#614385", "#516395"]}
              style={styles.mistikContainer}
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

              {/* Animasyonlu ay ikonu */}
              <Animated.View style={[styles.moonContainer, moonAnimatedStyle]}>
                <Ionicons
                  name="moon"
                  size={120}
                  color="rgba(255, 253, 225, 0.9)"
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
                      name={index % 2 === 0 ? "star" : "sparkles"}
                      size={index % 3 === 0 ? 24 : 18}
                      color="rgba(255, 253, 225, 0.9)"
                    />
                  </Animated.View>
                );
              })}

              <Text style={styles.mistikTitle}>Rüyanızı Keşfedin</Text>
              <Text style={styles.mistikText}>
                Rüyalarınızın İslami usullere göre yorumlanması için detaylı
                bilgileri girin.
              </Text>
            </LinearGradient>
          </View>

          {/* Form Bölümü */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <LinearGradient
              colors={["rgba(106, 53, 107, 0.8)", "rgba(81, 99, 149, 0.9)"]}
              style={styles.formGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View
                style={[styles.inputGroupContainer, inputAnimatedStyle]}
              >
                {/* Başlık Input */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="book-outline"
                    size={24}
                    color="#FFD700"
                    style={styles.inputIcon}
                  />
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
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color="#FFD700"
                    style={styles.inputIcon}
                  />
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
                  <Ionicons
                    name="pricetag-outline"
                    size={24}
                    color="#FFD700"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Kategori"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={category}
                    onChangeText={setCategory}
                  />
                </View>

                {/* Kaydet Butonu */}
                <TouchableOpacity onPress={handleSubmit} disabled={isLoading}>
                  <Animated.View
                    style={[
                      styles.submitButtonContainer,
                      submitButtonAnimatedStyle,
                    ]}
                  >
                    <LinearGradient
                      colors={["#FFD700", "#FF8C00"]}
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
                          <Ionicons name="sparkles" size={24} color="#FFFFFF" />
                          <Text style={styles.submitButtonText}>
                            Rüyamı Yorumla
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RuyaBak;
