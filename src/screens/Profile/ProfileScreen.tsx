import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
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
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "./ProfileScreenStyles";
import { ToastManager } from "../../utils/ToastManager";

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();

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
  const logoutButtonScale = useSharedValue(1);

  // Profil bilgileri (gerçek uygulamada API'den çekilecek)
  const profileInfo = {
    name: "Ahmet",
    surname: "Yılmaz",
    memberStatus: "onaylanmış",
    phoneVerified: true,
    membershipType: "Ücretsiz",
    dailyRemainingReviews: 2,
    dailyMaxReviews: 3,
    savedDreams: 8,
    email: "ahmet.yilmaz@example.com", // Yeni eklenen email alanı
    phoneNumber: "+90 555 123 45 67", // Yeni eklenen telefon numarası alanı
  };

  // Animasyonları başlat
  useEffect(() => {
    // Ay dönüş animasyonu
    moonRotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );

    // Ay boyut animasyonu
    moonScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.quad }),
        withTiming(0.95, { duration: 2000, easing: Easing.quad })
      ),
      -1,
      true
    );

    // Parlaklık animasyonu
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

  // Yıldız pozisyonları - rastgele konumlar
  const starPositions = [
    { top: "15%", left: "20%" },
    { top: "25%", right: "15%" },
    { top: "40%", left: "15%" },
    { top: "30%", right: "30%" },
    { top: "20%", left: "40%" },
  ];

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

  const logoutAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoutButtonScale.value }],
    };
  });

  // Çıkış yap butonu için işleyici
  const handleLogout = () => {
    // Buton animasyonu
    logoutButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    // Çıkış işlemini bildir
    ToastManager.show({
      message: "Başarıyla çıkış yapıldı!",
      type: "success",
      position: "top",
      duration: 3000,
      icon: "log-out-outline",
      iconColor: "#4CAF50",
    });

    // Gerçek bir uygulamada burada oturum kapatma işlemleri yapılır
    console.log("Çıkış yapılıyor...");
  };

  // Düzenleme işlevi için handler fonksiyonu
  const handleEdit = (field) => {
    // Buton animasyonu (düzenleme esnasında)
    logoutButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    // Düzenleme işlemini bildir
    ToastManager.show({
      message: `${field} bilgisini düzenliyorsunuz`,
      type: "info",
      position: "top",
      duration: 2000,
      icon: "create-outline",
      iconColor: "#3498db",
    });

    // Gerçek bir uygulamada burada düzenleme modalı açılır
    console.log(`${field} düzenleniyor...`);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#A979AA" }}
      edges={["right", "left"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: hp("15%"),
          paddingTop: insets.top + hp("8%"), // Header için alan bırak
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
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
            <Ionicons name="moon" size={60} color="rgba(255, 253, 225, 0.9)" />
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

          {/* Profil avatarı */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>

          {/* Kullanıcı adı ve soyadı */}
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {profileInfo.name} {profileInfo.surname}
            </Text>
            <Text style={styles.usernameText}>@ahmetyilmaz</Text>
          </View>
        </View>

        {/* Üyelik Bilgileri */}
        <View style={styles.infoContainer}>
          <LinearGradient
            colors={["rgba(106, 53, 107, 0.8)", "rgba(81, 99, 149, 0.9)"]}
            style={styles.infoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Üyelik Durumu */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Üyelik Durumu</Text>
              <View style={styles.verifiedContainer}>
                <Text style={styles.verifiedText}>Onaylanmış</Text>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </View>
            </View>

            {/* Telefon Doğrulaması */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Telefon Doğrulaması</Text>
              <View style={styles.verifiedContainer}>
                <Text
                  style={
                    profileInfo.phoneVerified
                      ? styles.verifiedText
                      : styles.unverifiedText
                  }
                >
                  {profileInfo.phoneVerified ? "Onaylanmış" : "Onaylanmamış"}
                </Text>
                <Ionicons
                  name={
                    profileInfo.phoneVerified
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={20}
                  color={profileInfo.phoneVerified ? "#4CAF50" : "#FF5252"}
                />
              </View>
            </View>

            {/* Üyelik Paketi */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Üyelik Paketi</Text>
              <Text style={styles.statusValue}>
                {profileInfo.membershipType}
              </Text>
            </View>

            {/* Kayıtlı Rüya Sayısı */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Kayıtlı Rüya Sayısı</Text>
              <Text style={styles.statusValue}>{profileInfo.savedDreams}</Text>
            </View>

            {/* E-posta */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>E-posta</Text>
              <View style={styles.editableContainer}>
                <Text style={styles.statusValue}>{profileInfo.email}</Text>
                <TouchableOpacity onPress={() => handleEdit("E-posta")}>
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color="#FFD700"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Telefon Numarası */}
            <View style={[styles.statusRow, styles.noBorder]}>
              <Text style={styles.statusLabel}>Telefon</Text>
              <View style={styles.editableContainer}>
                <Text style={styles.statusValue}>
                  {profileInfo.phoneNumber}
                </Text>
                <TouchableOpacity
                  onPress={() => handleEdit("Telefon numarası")}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color="#FFD700"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Günlük Rüya Yorum Hakkı */}
        <View style={styles.membershipContainer}>
          <LinearGradient
            colors={["rgba(81, 99, 149, 0.9)", "rgba(106, 53, 107, 0.8)"]}
            style={styles.membershipGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.membershipTitle}>Günlük Rüya Yorum Hakkı</Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Kalan Hak</Text>
              <Text style={styles.statusValue}>
                {profileInfo.dailyRemainingReviews}/
                {profileInfo.dailyMaxReviews}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${
                      (profileInfo.dailyRemainingReviews /
                        profileInfo.dailyMaxReviews) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Çıkış Yap Butonu */}
        <Animated.View style={[styles.logoutButton, logoutAnimatedStyle]}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{ width: "100%", height: "100%" }}
          >
            <LinearGradient
              colors={["#FF5252", "#FF8A8A"]}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
