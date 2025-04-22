import React, { useState } from "react";
import { View, TouchableOpacity, Platform, Animated } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import styles from "./CustomTabBarStyles";

// Basit animasyonlu TabBar bileşeni
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // SafeAreaInsets hook'u ile cihazın güvenli alanlarını alıyoruz
  const insets = useSafeAreaInsets();
  
  // Her tab için basit animasyon değerleri
  const [scaleValues] = useState(() => 
    state.routes.map(() => new Animated.Value(1))
  );

  // Tab ikonlarını belirle
  const getTabIcon = (
    routeName: string,
    isFocused: boolean
  ): keyof typeof Ionicons.glyphMap => {
    if (routeName === "RuyaList") {
      return isFocused ? "list" : "list-outline";
    } else if (routeName === "RuyaBak") {
      return "sparkles"; // Hep sabit bir ikon
    } else if (routeName === "Profil") {
      return isFocused ? "person" : "person-outline";
    }
    return "home"; // Varsayılan ikon
  };

  // Tab'a tıklanınca basit animasyon yap ve navigasyon yap
  const handleTabPress = (index: number, routeName: string) => {
    // Çok basit bir ölçek animasyonu
    Animated.sequence([
      Animated.timing(scaleValues[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValues[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigasyonu yap
    navigation.navigate(routeName);
  };

  return (
    <View
      style={[
        styles.container,
        // Bottom inset değeri 0'dan büyük ise (çentikli ekranlarda) minimal bir boşluk ekleyelim
        insets.bottom > 0
          ? { marginBottom: insets.bottom - 6 } // 6 değerini çıkartıyoruz çünkü container'da zaten bottom: 6 var
          : null,
      ]}
    >
      <LinearGradient
        colors={["#2D2D7D", "#4C4CA6", "#6060CF"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 25,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconName = getTabIcon(route.name, isFocused);
        const isMiddleTab = index === 1;

        // Orta tab için farklı stil ve davranış
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={() => handleTabPress(index, route.name)}
            style={[
              styles.tabButton,
              isMiddleTab && styles.middleTabButton,
              !isMiddleTab && isFocused && styles.activeTabButton,
            ]}
          >
            {isMiddleTab && (
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  borderRadius: hp("4.5%"),
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}

            {!isMiddleTab && isFocused && (
              <LinearGradient
                colors={["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  borderRadius: hp("3.5%"),
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}

            <Animated.View
              style={[
                styles.tabIcon,
                isMiddleTab && styles.tabIconMiddle,
                {
                  transform: [{ scale: scaleValues[index] }]
                }
              ]}
            >
              <Ionicons
                name={iconName}
                size={isMiddleTab ? 30 : 24}
                color={
                  isMiddleTab
                    ? "white"
                    : isFocused
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.7)"
                }
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
