import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./navigation/RootNavigator";
import { ToastProvider } from "./contexts/ToastContext";
import Toast from "./components/Toast/Toast";
import * as SplashScreen from "expo-splash-screen";

// Splash screen'i biraz daha uzun göstermek için
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Splash screen yüklenmezse hata yakalama */
});

const App: React.FC = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Uygulama hazırlık işlemleri (örn. font yükleme, API çağrıları vb.)
    async function prepare() {
      try {
        // Burada uygulamanın başlangıcında yapılması gereken işlemler yapılabilir
        // Örnek: await Font.loadAsync({});

        // Hazırlık işlemi bittiğinde 2 saniye bekleyelim (opsiyonel)
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("Uygulama başlatma hatası:", e);
      } finally {
        // Uygulama hazır olarak işaretlenir
        setAppIsReady(true);
        // Splash screen'i gizleyelim
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    // Uygulama hazır değilse boş bir ekran göster
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
