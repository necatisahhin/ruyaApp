import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Keyboard } from "react-native";
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
  const [searchText, setSearchText] = useState("");

  
  useEffect(() => {
    if (visible) {
      height.value = withTiming(60, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(1, { duration: 400 });

      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); 
    } else {
      height.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(0, { duration: 200 });
      
      
      setSearchText("");
      
      
      Keyboard.dismiss();
    }
    
    
    return () => {
      if (!visible) {
        setSearchText("");
      }
    };
  }, [visible]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
    };
  });

  
  const handleTextChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  
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
          value={searchText}
          onChangeText={handleTextChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#6A356B" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default SearchBar;
