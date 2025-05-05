import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import styles from "./CustomHeaderStyles";

interface CustomHeaderProps {
  title: string;
  
  showBackButton?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftIconColor?: string;
  onLeftPress?: () => void;
  
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightIconColor?: string;
  onRightPress?: () => void;
  
  rightIcon2?: keyof typeof Ionicons.glyphMap;
  rightIcon2Color?: string;
  onRightPress2?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  
  showBackButton = false,
  leftIcon,
  leftIconColor = "#FFFFFF",
  onLeftPress,
  
  rightIcon,
  rightIconColor = "#FFFFFF",
  onRightPress,
  
  rightIcon2,
  rightIcon2Color = "#FFFFFF",
  onRightPress2,
}) => {
  const navigation = useNavigation();
  
  const insets = useSafeAreaInsets();

  
  const handleLeftButtonPress = () => {
    
    
    if (onLeftPress) {
      onLeftPress();
    } 
    
    else if (showBackButton) {
      
      navigation.goBack();
    } 
    
    else if (leftIcon === "search") {
      
      
      navigation.dispatch(
        CommonActions.navigate({
          name: "TabNavigator",
          params: {
            screen: "RuyaList",
            params: { toggleSearch: true },
          },
        })
      );
    }
  };

  
  const handleFilterPress = () => {
    
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
        
        { top: insets.top },
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
          borderRadius: 20,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Sol taraf - Geri butonu veya özel ikon */}
      {(showBackButton || leftIcon) ? (
        <TouchableOpacity
          style={styles.leftButton}
          onPress={handleLeftButtonPress}
          disabled={!showBackButton && !onLeftPress && !leftIcon}
        >
          {showBackButton ? (
            <Ionicons name="arrow-back" size={24} color={leftIconColor} />
          ) : leftIcon ? (
            <Ionicons name={leftIcon} size={24} color={leftIconColor} />
          ) : null}
        </TouchableOpacity>
      ) : (
        <View style={{ width: hp("5%") }} />
      )}

      {/* Orta kısım - Başlık */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Sağ taraf - Butonlar bölgesi */}
      <View style={styles.rightButtonsContainer}>
        {/* İkinci sağ buton (varsa) */}
        {rightIcon2 && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPress2}
            disabled={!onRightPress2}
          >
            <Ionicons
              name={rightIcon2}
              size={24}
              color={rightIcon2Color}
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
