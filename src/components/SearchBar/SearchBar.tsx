import React, { useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "./SearchBarStyles";

interface SearchBarProps {
  visible: boolean;
  onSearch: (text: string) => void;
  onClose: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  visible,
  onSearch,
  onClose,
  placeholder = "Rüya ara...",
}) => {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  // Görünürlük değiştiğinde animasyon uygula
  useEffect(() => {
    if (visible) {
      height.value = withTiming(60, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(1, { duration: 400 });

      // Input'a odaklan
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      height.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
    };
  });

  // Header'ın yüksekliğini ve üst boşluğu hesaplayarak konumlandırma yapıyoruz
  const headerHeight = hp("8%");
  const topPosition = insets.top + headerHeight + hp("1%");

  return (
    <Animated.View
      style={[styles.container, animatedStyles, { top: topPosition }]}
    >
      <View style={styles.inputContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6A356B"
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onChangeText={onSearch}
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#6A356B" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default SearchBar;
