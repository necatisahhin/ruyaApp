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
  TextInput,
  Modal,
  Alert
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
import { logout, getUserProfile, updateUserProfile } from "../../services/authService";

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  
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

  
  const handleLogout = async () => {
    try {
      
      await logout();
      
      
      ToastManager.show({
        message: "Başarıyla çıkış yapıldı!",
        type: "success",
        position: "top",
        duration: 3000,
        icon: "log-out-outline",
        iconColor: "#4CAF50",
      });
      
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' as never }],
      });
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      
      
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

  
  const handleEdit = (field: string) => {
    let initialValue = "";
    
    switch(field) {
      case "Ad":
        initialValue = profileInfo.firstName;
        break;
      case "Soyad":
        initialValue = profileInfo.lastName;
        break;
      case "Yaş":
        initialValue = profileInfo.age.toString();
        break;
      case "Cinsiyet":
        initialValue = profileInfo.gender === "Erkek" ? "male" : 
                      profileInfo.gender === "Kadın" ? "female" : "other";
        break;
      case "Medeni Hal":
        initialValue = profileInfo.maritalStatus === "Bekar" ? "single" : 
                      profileInfo.maritalStatus === "Evli" ? "married" :
                      profileInfo.maritalStatus === "Boşanmış" ? "divorced" : "widowed";
        break;
      default:
        ToastManager.show({
          message: "Bu alan düzenlenemez!",
          type: "error",
          position: "top",
          duration: 3000,
          icon: "alert-circle-outline",
          iconColor: "#FF5252",
        });
        return;
    }
    
    setCurrentField(field);
    setEditValue(initialValue);
    setModalVisible(true);
  };
  
  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      
      const updateData: any = {};
      
      switch(currentField) {
        case "Ad":
          updateData.firstName = editValue;
          break;
        case "Soyad":
          updateData.lastName = editValue;
          break;
        case "Yaş":
          updateData.age = parseInt(editValue);
          break;
        case "Cinsiyet":
          updateData.gender = editValue;
          break;
        case "Medeni Hal":
          updateData.maritalStatus = editValue;
          break;
        default:
          return;
      }
      
      const response = await updateUserProfile(updateData);
      
      ToastManager.show({
        message: "Profiliniz başarıyla güncellendi!",
        type: "success",
        position: "top",
        duration: 3000,
        icon: "checkmark-circle-outline",
        iconColor: "#4CAF50",
      });
      
      if (response.data) {
        setProfileInfo(prevState => ({
          ...prevState,
          firstName: response.data.firstName || prevState.firstName,
          lastName: response.data.lastName || prevState.lastName,
          age: response.data.age || prevState.age,
          gender: response.data.gender === 'male' ? 'Erkek' : 
                  response.data.gender === 'female' ? 'Kadın' : 'Diğer',
          maritalStatus: response.data.maritalStatus === 'single' ? 'Bekar' : 
                         response.data.maritalStatus === 'married' ? 'Evli' : 
                         response.data.maritalStatus === 'divorced' ? 'Boşanmış' : 'Dul',
          profileImage: response.data.profileImage || prevState.profileImage,
        }));
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      ToastManager.show({
        message: "Profil güncellenemedi!",
        type: "error",
        position: "top",
        duration: 3000,
        icon: "alert-circle-outline",
        iconColor: "#FF5252",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A1A40' }}>
      <LinearGradient
        colors={["#1A1A40", "#2C2C6C", "#4B0082"]}
        style={[styles.backgroundImage, { height: '110%' }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Profil Düzenleme Modalı */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{currentField} Düzenle</Text>
              
              {currentField === "Cinsiyet" ? (
                <View style={styles.pickerContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      editValue === "male" && styles.selectedOption
                    ]}
                    onPress={() => setEditValue("male")}
                  >
                    <Text style={styles.optionText}>Erkek</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      editValue === "female" && styles.selectedOption
                    ]}
                    onPress={() => setEditValue("female")}
                  >
                    <Text style={styles.optionText}>Kadın</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      editValue === "other" && styles.selectedOption
                    ]}
                    onPress={() => setEditValue("other")}
                  >
                    <Text style={styles.optionText}>Diğer</Text>
                  </TouchableOpacity>
                </View>
              ) : currentField === "Medeni Hal" ? (
                <View style={styles.pickerContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      editValue === "single" && styles.selectedOption
                    ]}
                    onPress={() => setEditValue("single")}
                  >
                    <Text style={styles.optionText}>Bekar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      editValue === "married" && styles.selectedOption
                    ]}
                    onPress={() => setEditValue("married")}
                  >
                    <Text style={styles.optionText}>Evli</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      editValue === "divorced" && styles.selectedOption
                    ]}
                    onPress={() => setEditValue("divorced")}
                  >
                    <Text style={styles.optionText}>Boşanmış</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.optionButton,
                      editValue === "widowed" && styles.selectedOption
                    ]}
                    onPress={() => setEditValue("widowed")}
                  >
                    <Text style={styles.optionText}>Dul</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={`${currentField} giriniz`}
                  placeholderTextColor="#999"
                  keyboardType={currentField === "Yaş" ? "numeric" : "default"}
                />
              )}
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleUpdate}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Kaydet</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
              paddingBottom: hp("20%"),
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
                  {/* Ad */}
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Ad</Text>
                    <View style={styles.editableContainer}>
                      <Text style={styles.statusValue}>{profileInfo.firstName}</Text>
                      <TouchableOpacity onPress={() => handleEdit("Ad")}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color="#FFD700"
                          style={styles.editIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Soyad */}
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Soyad</Text>
                    <View style={styles.editableContainer}>
                      <Text style={styles.statusValue}>{profileInfo.lastName}</Text>
                      <TouchableOpacity onPress={() => handleEdit("Soyad")}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color="#FFD700"
                          style={styles.editIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

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
                    </View>
                  </View>

                  {/* Telefon Numarası */}
                  <View style={[styles.statusRow, styles.noBorder]}>
                    <Text style={styles.statusLabel}>Telefon</Text>
                    <View style={styles.editableContainer}>
                      <Text style={styles.statusValue}>
                        {profileInfo.phone}
                      </Text>
                    </View>
                  </View>

                  {/* Şifre Değiştir */}
                  
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
