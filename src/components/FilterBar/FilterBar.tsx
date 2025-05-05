import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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
import styles from "./FilterBarStyles";

interface FilterBarProps {
  visible: boolean;
  onClose: () => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  categories: string[]; 
  selectedCategories: string[]; 
  onToggleCategory: (category: string) => void; 
}

const FilterBar: React.FC<FilterBarProps> = ({
  visible,
  onClose,
  showFavorites,
  onToggleFavorites,
  categories,
  selectedCategories,
  onToggleCategory,
}) => {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  
  useEffect(() => {
    if (visible) {
      
      
      const baseHeight = 60; 
      const categoryAreaHeight = categories.length > 0 ? 30 : 0; 

      
      const categoryRowsHeight = categoriesExpanded
        ? Math.ceil(categories.length / 3) * 30 
        : 0;

      const calculatedHeight =
        baseHeight + categoryAreaHeight + categoryRowsHeight;

      height.value = withTiming(calculatedHeight, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      height.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, categories.length, categoriesExpanded]);

  
  const toggleCategories = () => {
    setCategoriesExpanded(!categoriesExpanded);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
    };
  });

  
  const headerHeight = hp("8%");
  const topPosition = insets.top + headerHeight + hp("1%");

  return (
    <Animated.View
      style={[styles.container, animatedStyles, { top: topPosition }]}
    >
      <View style={styles.filterContainer}>
        <Ionicons
          name="filter"
          size={20}
          color="#6A356B"
          style={styles.filterIcon}
        />
        <View style={styles.optionsContainer}>
          {/* Favori filtresi */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={onToggleFavorites}
          >
            <Ionicons
              name={showFavorites ? "checkbox" : "square-outline"}
              size={22}
              color="#6A356B"
            />
            <Text style={styles.checkboxLabel}>Favori rüyalarım</Text>
          </TouchableOpacity>

          {/* Kategoriler filtresi */}
          {categories.length > 0 && (
            <>
              <TouchableOpacity
                style={styles.categoryTitleContainer}
                onPress={toggleCategories}
              >
                <Text style={styles.categoryTitle}>Kategoriler</Text>
                <Ionicons
                  name={categoriesExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#6A356B"
                />
              </TouchableOpacity>

              {categoriesExpanded && (
                <View style={styles.categoriesContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.categoryItem}
                      onPress={() => onToggleCategory(category)}
                    >
                      <Ionicons
                        name={
                          selectedCategories.includes(category)
                            ? "checkbox"
                            : "square-outline"
                        }
                        size={20}
                        color="#6A356B"
                      />
                      <Text style={styles.categoryLabel}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#6A356B" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default FilterBar;
