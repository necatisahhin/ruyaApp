import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./CustomHeaderStyles";

interface CustomHeaderProps {
  title: string;
  // Sol buton özellikleri
  showBackButton?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftIconColor?: string;
  onLeftPress?: () => void;
  // Sağ buton özellikleri
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightIconColor?: string;
  onRightPress?: () => void;
  // İkinci sağ buton özellikleri (opsiyonel)
  secondRightIcon?: keyof typeof Ionicons.glyphMap;
  secondRightIconColor?: string;
  onSecondRightPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  // Sol buton props'ları
  showBackButton = false,
  leftIcon,
  leftIconColor = "#FFFFFF",
  onLeftPress,
  // Sağ buton props'ları
  rightIcon,
  rightIconColor = "#FFFFFF",
  onRightPress,
  // İkinci sağ buton props'ları
  secondRightIcon,
  secondRightIconColor = "#FFFFFF",
  onSecondRightPress,
}) => {
  const navigation = useNavigation();
  // Güvenli alan sınırlarını alıyoruz
  const insets = useSafeAreaInsets();

  // Sol buton için işlem fonksiyonu
  const handleLeftButtonPress = () => {
    // Özel işlem tanımlanmışsa onu kullan, yoksa ve geri butonu ise navigation.goBack() çağır
    if (onLeftPress) {
      onLeftPress();
    } else if (showBackButton) {
      navigation.goBack();
    }
  };

  // Arama butonuna tıklandığında
  const handleSearchPress = () => {
    // CommonActions kullanarak doğru navigasyon
    navigation.dispatch(
      CommonActions.navigate({
        name: "TabNavigator",
        params: {
          screen: "RuyaList",
          params: { toggleSearch: true },
        },
      })
    );
  };

  // Filtre butonuna tıklandığında
  const handleFilterPress = () => {
    // CommonActions kullanarak doğru navigasyon
    navigation.dispatch(
      CommonActions.navigate({
        name: "TabNavigator",
        params: {
          screen: "RuyaList",
          params: { toggleFilter: true },
        },
      })
    );
  };

  return (
    <View
      style={[
        styles.container,
        // Üst kısımda güvenli alan için dinamik padding ekliyoruz
        { top: insets.top },
      ]}
    >
      {/* Sol taraf - Geri butonu veya özel ikon */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={handleLeftButtonPress}
        disabled={!showBackButton && !onLeftPress && !leftIcon}
      >
        {showBackButton ? (
          <Ionicons name="arrow-back" size={24} color={leftIconColor} />
        ) : leftIcon ? (
          <Ionicons name={leftIcon} size={24} color={leftIconColor} />
        ) : (
          <View />
        )}
      </TouchableOpacity>

      {/* Orta kısım - Başlık */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Sağ taraf - Butonlar bölgesi */}
      <View style={styles.rightButtonsContainer}>
        {/* İkinci sağ buton (varsa) */}
        {secondRightIcon && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onSecondRightPress}
            disabled={!onSecondRightPress}
          >
            <Ionicons
              name={secondRightIcon}
              size={24}
              color={secondRightIconColor}
            />
          </TouchableOpacity>
        )}

        {/* Ana sağ buton */}
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPress}
            disabled={!onRightPress}
          >
            <Ionicons name={rightIcon} size={24} color={rightIconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomHeader;
