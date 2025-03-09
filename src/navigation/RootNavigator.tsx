import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

// Örnek ekranlar (siz kendi ekranlarınızı oluşturacaksınız)
import HomeScreen from "../screens/Ruyalar/RuyaList";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import RuyaBak from "../screens/RuyaBak/RuyaBakScreen";
import RuyaYorumSonucScreen from "../screens/RuyaYorumSonuc/RuyaYorumSonucScreen";
import CustomTabBar from "../components/CustomTabBar/CustomTabBar";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
  CommonActions,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";

// Rüya yorumlama için parametre tipi
export type RuyaYorumParams = {
  baslik: string;
  icerik: string;
  kategori: string;
  yorum: string;
  tarih: Date;
  fromSavedDream?: boolean; // Kayıtlı rüyadan geliyorsa true olacak yeni parametre
};

// Tab navigator tipini tanımlayalım
export type RootTabParamList = {
  RuyaList:
    | undefined
    | {
        showSearch?: boolean;
        showFilter?: boolean;
        toggleSearch?: boolean;
        toggleFilter?: boolean;
      };
  RuyaBak: undefined;
  Profil: undefined;
};

// Stack navigator tipini tanımlayalım
export type RootStackParamList = {
  TabNavigator: {
    screen?: keyof RootTabParamList;
    params?: {
      showSearch?: boolean;
      showFilter?: boolean;
      toggleSearch?: boolean;
      toggleFilter?: boolean;
    };
  };
  RuyaYorumSonuc: RuyaYorumParams;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Navigator bileşeni
const TabNavigator = () => {
  // Aktif ekran başlığını ve ekran adını takip etmek için state ekliyoruz
  const [activeScreenTitle, setActiveScreenTitle] =
    useState<string>("Rüyalarım");
  const [activeRouteName, setActiveRouteName] = useState<string>("RuyaList");
  const navigation = useNavigation();

  // Ekran başlıklarını tanımlıyoruz
  const screenTitles: { [key: string]: string } = {
    RuyaList: "Rüyalarım",
    RuyaBak: "Rüya Bak",
    Profil: "Profil",
  };

  // Tab değiştiğinde başlığı ve aktif ekranı güncelliyoruz
  const handleTabChange = (state: any) => {
    if (state.routes && state.routes.length > 0) {
      const routeName = state.routes[state.index].name;
      setActiveRouteName(routeName);
      setActiveScreenTitle(screenTitles[routeName] || "El Emeği");
    }
  };

  // Ekrana göre header özelliklerini belirliyoruz
  const getHeaderProps = () => {
    // Varsayılan özellikler
    const defaultProps = {
      title: activeScreenTitle,
      rightIcon: "notifications-outline" as keyof typeof Ionicons.glyphMap,
      onRightPress: () => console.log("Bildirimler açıldı"),
    };

    // Ekrana özel özellikler
    switch (activeRouteName) {
      case "RuyaList":
        return {
          ...defaultProps,
          leftIcon: "search" as keyof typeof Ionicons.glyphMap,
          onLeftPress: () => {
            // Arama ikonuna tıklanınca CommonActions ile doğrudan parametre gönderiyoruz
            navigation.dispatch(
              CommonActions.navigate({
                name: "TabNavigator",
                params: {
                  screen: "RuyaList",
                  params: { toggleSearch: true },
                },
              })
            );
          },
          rightIcon: "filter-outline" as keyof typeof Ionicons.glyphMap,
          onRightPress: () => {
            // Filtre ikonuna tıklanınca CommonActions ile doğrudan parametre gönderiyoruz
            navigation.dispatch(
              CommonActions.navigate({
                name: "TabNavigator",
                params: {
                  screen: "RuyaList",
                  params: { toggleFilter: true },
                },
              })
            );
          },
        };
      case "RuyaBak":
        return {
          ...defaultProps,
          rightIcon: "add-circle" as keyof typeof Ionicons.glyphMap,
          rightIconColor: "#FFD700",
          onRightPress: () => console.log("Yeni rüya ekle"),
        };
      case "Profil":
        return {
          ...defaultProps,
          rightIcon: "settings-outline" as keyof typeof Ionicons.glyphMap,
          onRightPress: () => console.log("Ayarlar açıldı"),
        };
      default:
        return defaultProps;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* CustomHeader'da dinamik başlık ve ekrana özel butonlar kullanıyoruz */}
      <CustomHeader {...getHeaderProps()} />

      <Tab.Navigator
        // ...mevcut kod...
        screenOptions={{
          headerStyle: {
            backgroundColor: "#6A356B",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarShowLabel: false,
          // Custom Header kullandığımız için varsayılan header'ı gizliyoruz
          headerShown: false,
          // İçerik alanının altında TabBar yüksekliği kadar boşluk bırakmak için
          tabBarStyle: { height: 0, display: "none" },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
        // Tab değişikliğini izliyoruz
        screenListeners={{
          state: (e) => {
            handleTabChange(e.data.state);
          },
        }}
      >
        <Tab.Screen
          name="RuyaList"
          component={HomeScreen}
          options={{ title: "Rüyalarım" }}
        />
        <Tab.Screen
          name="RuyaBak"
          component={RuyaBak}
          options={{ title: "Rüya Bak" }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfileScreen}
          options={{ title: "Profil" }}
        />
      </Tab.Navigator>
    </View>
  );
};

// Root Navigator bileşeni
const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen
        name="RuyaYorumSonuc"
        component={RuyaYorumSonucScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
