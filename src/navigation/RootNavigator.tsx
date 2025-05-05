import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";


import HomeScreen from "../screens/Ruyalar/RuyaList";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import RuyaBak from "../screens/RuyaBak/RuyaBakScreen";
import RuyaYorumSonucScreen from "../screens/RuyaYorumSonuc/RuyaYorumSonucScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import CustomTabBar from "../components/CustomTabBar/CustomTabBar";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";


export type RuyaYorumParams = {
  baslik: string;
  icerik: string;
  kategori: string;
  yorum: string;
  tarih: Date;
  fromSavedDream?: boolean; 
};


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


export type RootStackParamList = {
  Auth: undefined;
  Login: {
    returnScreen?: string;
    returnParams?: any;
  } | undefined;
  Register: undefined;
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


export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();


const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};


const TabNavigator = () => {
  
  const [activeScreenTitle, setActiveScreenTitle] =
    useState<string>("Rüyalarım");
  const [activeRouteName, setActiveRouteName] = useState<string>("RuyaList");
  const navigation = useNavigation();

  
  const screenTitles: { [key: string]: string } = {
    RuyaList: "Rüyalarım",
    RuyaBak: "Rüya Bak",
    Profil: "Profil",
  };

  
  const handleTabChange = (state: any) => {
    if (state.routes && state.routes.length > 0) {
      const routeName = state.routes[state.index].name;
      setActiveRouteName(routeName);
      setActiveScreenTitle(screenTitles[routeName] || "El Emeği");
    }
  };

  
  const getHeaderProps = () => {
    
    const defaultProps = {
      title: activeScreenTitle,
      rightIcon: "notifications-outline" as keyof typeof Ionicons.glyphMap,
      onRightPress: () => console.log("Bildirimler açıldı"),
    };

    
    switch (activeRouteName) {
      case "RuyaList":
        return {
          ...defaultProps,
          leftIcon: "search" as keyof typeof Ionicons.glyphMap,
          onLeftPress: () => {
            
            
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
          rightIcon2: "filter" as keyof typeof Ionicons.glyphMap,
          onRightPress2: () => {
            
            
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
        };
      case "Profil":
        return {
          ...defaultProps,
          rightIcon: "notifications-outline" as keyof typeof Ionicons.glyphMap,
          onRightPress: () => console.log("Bildirimler açıldı"),
        };
      default:
        return defaultProps;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader {...getHeaderProps()} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
        screenListeners={{
          state: (e) => {
            handleTabChange(e.data.state);
          },
        }}
      >
        <Tab.Screen name="RuyaList" component={HomeScreen} />
        <Tab.Screen name="RuyaBak" component={RuyaBak} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
};


const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const Stack = createStackNavigator<RootStackParamList>();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      
      const userToken = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!userToken);
    } catch (error) {
      console.error("Kimlik doğrulama kontrolü sırasında hata:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6A11CB" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isAuthenticated ? "TabNavigator" : "Auth"}
    >
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="RuyaYorumSonuc" component={RuyaYorumSonucScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
