import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./navigation/RootNavigator";
import { ToastProvider } from "./contexts/ToastContext";
import Toast from "./components/Toast/Toast";
import * as SplashScreen from "expo-splash-screen";


SplashScreen.preventAutoHideAsync().catch(() => {
  /* Splash screen yüklenmezse hata yakalama */
});

const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    
    async function prepare() {
      try {
        
        

        
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("Uygulama başlatma hatası:", e);
      } finally {
        
        setAppIsReady(true);
        
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    
    return null;
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#1E1A33"
            translucent={true}
          />
          <RootNavigator />
          <Toast />
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;
