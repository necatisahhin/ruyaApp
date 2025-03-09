import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./CustomTabBarStyles";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // SafeAreaInsets hook'u ile cihazın güvenli alanlarını alıyoruz
  const insets = useSafeAreaInsets();

  // Animasyon için useSharedValue değerleri
  const rotateValues = state.routes.map(() => useSharedValue(0));
  const scaleValues = state.routes.map(() => useSharedValue(1));
  const opacityValues = state.routes.map(() => useSharedValue(0));

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

  // Tab'a tıklanınca animasyon yap
  const handleTabPress = (index: number, routeName: string) => {
    // Dönme animasyonu
    rotateValues[index].value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(-1, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );

    // Ölçek animasyonu
    scaleValues[index].value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );

    // Basit vurgu animasyonu (orta buton hariç)
    if (index !== 1) {
      opacityValues[index].value = withSequence(
        withTiming(0.6, { duration: 150 }),
        withTiming(0, { duration: 300 })
      );
    }

    // Navigasyonu yap
    const event = navigation.emit({
      type: "tabPress",
      target: routeName,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  // Animasyon stilleri
  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scaleValues[index].value },
          { rotate: `${rotateValues[index].value * 30}deg` },
        ],
      };
    });
  };

  // Vurgu efekti için stil
  const getHighlightStyle = (index: number) => {
    return useAnimatedStyle(() => {
      return {
        opacity: opacityValues[index].value,
      };
    });
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
            {!isMiddleTab && (
              <Animated.View
                style={[styles.highlightEffect, getHighlightStyle(index)]}
              />
            )}

            <Animated.View
              style={[
                styles.tabIcon,
                isMiddleTab && styles.tabIconMiddle,
                getAnimatedStyle(index),
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
            {/* Tab isimleri kaldırıldı */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
