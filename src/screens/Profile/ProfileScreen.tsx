import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "./ProfileScreenStyles";
import { ToastManager } from "../../utils/ToastManager";
import { useNavigation } from "@react-navigation/native";
import { logout, getUserProfile } from "../../services/authService";

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // State tanımlamaları
  const [loading, setLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: 0,
    gender: "",
    maritalStatus: "",
    profileImage: null,
  });
  
  // Profil bilgilerini yükle
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        
        setProfileInfo({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          age: userData.age || 0,
          gender: userData.gender === 'male' ? 'Erkek' : userData.gender === 'female' ? 'Kadın' : 'Diğer',
          maritalStatus: userData.maritalStatus === 'single' ? 'Bekar' : 
                         userData.maritalStatus === 'married' ? 'Evli' : 
                         userData.maritalStatus === 'divorced' ? 'Boşanmış' : 'Dul',
          profileImage: userData.profileImage,
        });
      } catch (error) {
        console.error("Profil bilgileri yüklenirken hata:", error);
        ToastManager.show({
          message: "Profil bilgileri yüklenemedi!",
          type: "error",
          position: "top",
          duration: 3000,
          icon: "alert-circle-outline",
          iconColor: "#FF5252",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Çıkış yap butonu için işleyici
  const handleLogout = async () => {
    try {
      // authService'den logout fonksiyonunu çağır
      await logout();
      
      // Çıkış işlemini bildir
      ToastManager.show({
        message: "Başarıyla çıkış yapıldı!",
        type: "success",
        position: "top",
        duration: 3000,
        icon: "log-out-outline",
        iconColor: "#4CAF50",
      });
      
      // Kullanıcıyı giriş ekranına yönlendir
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' as never }],
      });
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      
      // Hata durumunda kullanıcıya bildir
      ToastManager.show({
        message: "Çıkış yapılırken bir hata oluştu!",
        type: "error",
        position: "top",
        duration: 3000,
        icon: "alert-circle-outline",
        iconColor: "#FF5252",
      });
    }
  };

  // Düzenleme işlevi için handler fonksiyonu
  const handleEdit = (field: string) => {
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
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#1A1A40", "#2C2C6C", "#4B0082"]}
        style={styles.backgroundImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Profil bilgileri yükleniyor...</Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: hp("10%"),
              paddingTop: insets.top + hp("5%"),
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              {/* Profil Başlık Bölümü */}
              <View style={styles.profileHeader}>
                {/* Profil avatarı */}
                <View style={styles.avatarContainer}>
                  {profileInfo.profileImage ? (
                    <Image
                      source={{ uri: profileInfo.profileImage }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.defaultAvatarContainer}>
                      <Ionicons
                        name="person"
                        size={hp("10%")}
                        color="#1A1A40"
                      />
                    </View>
                  )}
                </View>

                {/* Kullanıcı adı ve soyadı */}
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>
                    {profileInfo.firstName} {profileInfo.lastName}
                  </Text>
                </View>
              </View>

              {/* Üyelik Bilgileri */}
              <View style={styles.infoContainer}>
                <LinearGradient
                  colors={["rgba(75, 0, 130, 0.8)", "rgba(25, 25, 112, 0.9)"]}
                  style={styles.infoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Yaş */}
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Yaş</Text>
                    <View style={styles.editableContainer}>
                      <Text style={styles.statusValue}>{profileInfo.age}</Text>
                      <TouchableOpacity onPress={() => handleEdit("Yaş")}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color="#FFD700"
                          style={styles.editIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Cinsiyet */}
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Cinsiyet</Text>
                    <View style={styles.editableContainer}>
                      <Text style={styles.statusValue}>{profileInfo.gender}</Text>
                      <TouchableOpacity onPress={() => handleEdit("Cinsiyet")}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color="#FFD700"
                          style={styles.editIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Medeni Hal */}
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Medeni Hal</Text>
                    <View style={styles.editableContainer}>
                      <Text style={styles.statusValue}>{profileInfo.maritalStatus}</Text>
                      <TouchableOpacity onPress={() => handleEdit("Medeni Hal")}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color="#FFD700"
                          style={styles.editIcon}
                        />
                      </TouchableOpacity>
                    </View>
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
                        {profileInfo.phone}
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

              {/* Çıkış Yap Butonu */}
              <View style={styles.logoutButtonContainer}>
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{ width: "100%", height: "100%" }}
                >
                  <LinearGradient
                    colors={["#FF5252", "#FF8A8A"]}
                    style={styles.logoutButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.buttonIconContainer}>
                      <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.logoutText}>Çıkış Yap</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProfileScreen;
