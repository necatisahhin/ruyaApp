import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ruya } from "../../models/RuyaModel";
import styles from "./RuyaCardStyles";
import { Ionicons } from "@expo/vector-icons";
import { ToastManager } from "../../utils/ToastManager";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
  withRepeat,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface RuyaCardProps {
  ruya: Ruya;
  onPress?: (ruya: Ruya) => void;
  onFavoriteToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewInterpretation?: (ruya: Ruya) => void; 
}

const RuyaCard: React.FC<RuyaCardProps> = ({
  ruya,
  onPress,
  onFavoriteToggle,
  onDelete,
  onViewInterpretation,
}) => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [isInterpretationVisible, setIsInterpretationVisible] = useState(false);

  
  const menuHeight = useSharedValue(0);
  const menuOpacity = useSharedValue(0);
  const rotateValue = useSharedValue(0);

  
  const menuScale = useSharedValue(0.5);
  const buttonPressFeedback = useSharedValue(1);
  const shareButtonX = useSharedValue(-50);
  const deleteButtonX = useSharedValue(50);
  const viewInterpretationButtonX = useSharedValue(-50); 
  const menuItemsOpacity = useSharedValue(0);
  const gradientPosition = useSharedValue(0);

  
  const interpretationHeight = useSharedValue(0);
  const interpretationOpacity = useSharedValue(0);
  const interpretationRotate = useSharedValue(0);

  
  useEffect(() => {
    gradientPosition.value = withRepeat(
      withTiming(4, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  
  const formatTarih = (tarih: Date | string | undefined): string => {
    if (tarih === undefined) return "";
    if (typeof tarih === "string") return tarih;
    if (tarih instanceof Date) {
      return tarih.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "";
  };

  
  const handleFavoritePress = () => {
    
    buttonPressFeedback.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    if (onFavoriteToggle) {
      onFavoriteToggle(ruya.id);

      if (!ruya.isFavorite) {
        ToastManager.show({
          message: `${ruya.baslik} favorilerinize eklendi.`,
          type: "success",
          icon: "star",
          iconColor: "#FF6B6B",
          position: "top",
          buttons: [
            {
              text: "Geri Al",
              onPress: () => {
                if (onFavoriteToggle) onFavoriteToggle(ruya.id);
              },
              style: "secondary",
            },
            {
              text: "Tamam",
              onPress: () => {},
              style: "primary",
            },
          ],
        });
      } else {
        ToastManager.show({
          message: `${ruya.baslik} favorilerinizden çıkarıldı.`,
          type: "info",
          icon: "star-outline",
          iconColor: "#FF6B6B",
          duration: 2000,
          position: "top",
        });
      }
    }
  };

  
  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);

    if (newMenuState) {
      
      rotateValue.value = withSpring(1, { damping: 14, stiffness: 100 });
      menuHeight.value = withSpring(200, {
        damping: 12,
        stiffness: 90,
        mass: 0.8,
      });
      menuOpacity.value = withTiming(1, { duration: 300 });
      menuScale.value = withSpring(1, { damping: 14, stiffness: 90 });

      
      shareButtonX.value = withDelay(
        150,
        withSpring(0, { damping: 12, stiffness: 70 })
      );
      deleteButtonX.value = withDelay(
        250,
        withSpring(0, { damping: 12, stiffness: 70 })
      );
      viewInterpretationButtonX.value = withDelay(
        350,
        withSpring(0, { damping: 12, stiffness: 70 })
      );
      menuItemsOpacity.value = withDelay(150, withTiming(1, { duration: 300 }));
    } else {
      
      rotateValue.value = withSpring(0, { damping: 14, stiffness: 100 });
      menuHeight.value = withTiming(0, { duration: 300 });
      menuOpacity.value = withTiming(0, { duration: 200 });
      menuScale.value = withTiming(0.5, { duration: 300 });

      
      shareButtonX.value = withTiming(-50, { duration: 200 });
      deleteButtonX.value = withTiming(50, { duration: 200 });
      viewInterpretationButtonX.value = withTiming(-50, { duration: 200 });
      menuItemsOpacity.value = withTiming(0, { duration: 100 });
    }
  };

  
  const handleShare = () => {
    
    buttonPressFeedback.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 300 })
    );

    ToastManager.show({
      message: "Bu özellik henüz kullanılamıyor",
      type: "info",
      icon: "information-circle",
      position: "top",
      duration: 2000,
    });
  };

  
  const handleDelete = () => {
    
    buttonPressFeedback.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 300 })
    );

    ToastManager.show({
      message: `${ruya.baslik} rüyanızı silmek istediğinizden emin misiniz?`,
      type: "warning",
      icon: "alert-circle",
      iconColor: "#FF9800",
      position: "top",
      buttons: [
        {
          text: "İptal",
          onPress: () => {
            console.log("Silme işlemi iptal edildi");
          },
          style: "secondary",
        },
        {
          text: "Evet, Sil",
          onPress: () => {
            if (onDelete) {
              onDelete(ruya.id);

              
              ToastManager.show({
                message: `${ruya.baslik} rüyanız silindi.`,
                type: "info",
                icon: "trash",
                iconColor: "#FF6B6B",
                position: "top",
                duration: 2000,
              });

              
              toggleMenu();
            }
          },
          style: "primary",
        },
      ],
    });
  };

  
  const handleCardPress = () => {
    if (onPress) {
      onPress(ruya);
    }
  };

  
  const toggleInterpretationVisibility = () => {
    
    if (isMenuOpen) {
      toggleMenu();
    }

    
    const newState = !isInterpretationVisible;
    setIsInterpretationVisible(newState);

    
    if (newState) {
      
      interpretationHeight.value = withSpring(230, {
        damping: 12,
        stiffness: 90,
        mass: 0.8,
      });
      interpretationOpacity.value = withTiming(1, { duration: 300 });
      interpretationRotate.value = withSpring(1, {
        damping: 14,
        stiffness: 100,
      });
    } else {
      
      interpretationHeight.value = withTiming(0, { duration: 300 });
      interpretationOpacity.value = withTiming(0, { duration: 200 });
      interpretationRotate.value = withSpring(0, {
        damping: 14,
        stiffness: 100,
      });
    }
  };

  
  const handleViewInterpretation = () => {
    
    buttonPressFeedback.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 300 })
    );

    
    console.log(`Rüya Yorumu (${ruya.baslik}):`, ruya.yorum);

    
    toggleMenu();

    
    toggleInterpretationVisibility();
  };

  
  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(rotateValue.value, [0, 1], [0, 90])}deg` },
    ],
  }));

  const menuContainerAnimatedStyle = useAnimatedStyle(() => ({
    height: menuHeight.value,
    opacity: menuOpacity.value,
    transform: [{ scale: menuScale.value }],
    transformOrigin: "bottom",
  }));

  const shareButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuItemsOpacity.value,
    transform: [{ translateX: shareButtonX.value }],
  }));

  const deleteButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuItemsOpacity.value,
    transform: [{ translateX: deleteButtonX.value }],
  }));

  const favButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonPressFeedback.value }],
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(gradientPosition.value, [0, 4], [-300, 300]),
      },
    ],
  }));

  
  const interpretationContainerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpretationHeight.value,
    opacity: interpretationOpacity.value,
  }));

  
  const interpretationIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          interpretationRotate.value,
          [0, 1],
          [0, 180]
        )}deg`,
      },
    ],
  }));

  
  const viewInterpretationButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: menuItemsOpacity.value,
      transform: [
        { translateX: viewInterpretationButtonX.value },
        { scale: buttonPressFeedback.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={handleCardPress}>
        <View style={styles.cardContent}>
          {/* Arka plan gradient */}
          <LinearGradient
            colors={["#614385", "#516395"]}
            style={styles.cardBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{ruya.baslik}</Text>
                <Text style={styles.category}>{ruya.kategori}</Text>
              </View>
              <TouchableOpacity
                style={styles.chevronContainer}
                onPress={toggleMenu}
                activeOpacity={0.7}
              >
                <Animated.View style={chevronAnimatedStyle}>
                  <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{ruya.icerik}</Text>
            </View>

            <View style={styles.dateContainer}>
              <TouchableOpacity onPress={handleFavoritePress}>
                <Animated.View style={favButtonAnimatedStyle}>
                  <Ionicons
                    name={ruya.isFavorite ? "star" : "star-outline"}
                    size={24}
                    color={ruya.isFavorite ? "#FFD700" : "#FFFFFF"}
                  />
                </Animated.View>
              </TouchableOpacity>
              <Text style={styles.date}>{formatTarih(ruya.tarih)}</Text>

              {/* Rüya yorumu varsa gösterge ikonu ekle */}
              {ruya.yorum && (
                <TouchableOpacity
                  onPress={toggleInterpretationVisibility}
                  style={styles.interpretationIndicator}
                >
                  <Animated.View style={interpretationIconAnimatedStyle}>
                    <Ionicons
                      name={isInterpretationVisible ? "chevron-up" : "book"}
                      size={18}
                      color="#FFD700"
                    />
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Yorum Bölümü - Açılıp kapanabilir */}
          {ruya.yorum && (
            <Animated.View
              style={[
                styles.interpretationContainer,
                interpretationContainerAnimatedStyle,
              ]}
            >
              <LinearGradient
                colors={["rgba(106, 53, 107, 0.8)", "rgba(81, 99, 149, 0.9)"]}
                style={styles.interpretationGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.interpretationHeaderContainer}>
                  <View style={styles.interpretationHeaderLine} />
                  <Text style={styles.interpretationHeaderText}>
                    İslami Rüya Yorumu
                  </Text>
                </View>
                <Text style={styles.interpretationText}>
                  {ruya.yorum.length > 300
                    ? ruya.yorum.substring(0, 300) + "..."
                    : ruya.yorum}
                </Text>
                <TouchableOpacity
                  style={styles.fullInterpretationButton}
                  onPress={() =>
                    onViewInterpretation && onViewInterpretation(ruya)
                  }
                >
                  <Text style={styles.fullInterpretationButtonText}>
                    Yorumun Tamamını Gör
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFD700" />
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          )}
        </View>
      </Pressable>

      {/* Kartın dışında (altında) açılan modern menü container */}
      <Animated.View style={[styles.menuContainer, menuContainerAnimatedStyle]}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.2)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.menuGradient}
        >
          <Animated.View style={gradientAnimatedStyle}>
            <View style={styles.gradientContent}></View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.menuHeader}>
          <View style={styles.menuHeaderLine} />
          <Text style={styles.menuTitle}>İşlemler</Text>
        </View>

        <View style={styles.menuContent}>
          {/* Paylaş butonu */}
          <Animated.View
            style={[styles.menuItemContainer, shareButtonAnimatedStyle]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#2196F3", "#42A5F5", "#64B5F6"]}
                style={styles.menuItemGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="share-social" size={26} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.menuItemText}>Paylaş</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Sil butonu */}
          <Animated.View
            style={[styles.menuItemContainer, deleteButtonAnimatedStyle]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#FF5252", "#FF7373", "#FF8A8A"]}
                style={styles.menuItemGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="trash" size={26} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.menuItemText}>Sil</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Yorum görüntüleme butonu - Sadece yorum varsa göster */}
          <Animated.View
            style={[
              styles.menuItemContainer,
              viewInterpretationButtonAnimatedStyle,
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleViewInterpretation}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#4CAF50", "#66BB6A", "#81C784"]} 
                style={styles.menuItemGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="book-outline" size={26} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.menuItemText}>Yorumu Gör</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};
export default RuyaCard;
