import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./EmptyStateMessageStyles";

interface EmptyStateMessageProps {
  showFavorites?: boolean;
  customMessage?: string;
}

/**
 * Boş liste durumunda gösterilecek mesaj bileşeni
 * @param showFavorites - Favori filtresi aktif mi
 * @param customMessage - Özel mesaj (isteğe bağlı)
 */
const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  showFavorites = false,
  customMessage,
}) => {
  
  
  const message = customMessage
    ? customMessage
    : showFavorites
    ? "Hiç bir favori rüyanız yok"
    : "Henüz hiç rüya eklenmemiş";

  const subMessage = showFavorites
    ? "Favori rüyalarınız burada görünecek"
    : "Yeni bir rüya eklemek için 'Rüya Bak' ekranına gidin";

  const iconName = showFavorites ? "star" : "book";

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={50} color="rgba(255, 255, 255, 0.8)" style={{ marginBottom: 15 }} />
      <Text style={styles.text}>{message}</Text>
      <Text style={[styles.text, { fontSize: 14, marginTop: 10, backgroundColor: 'transparent' }]}>
        {subMessage}
      </Text>
    </View>
  );
};

export default EmptyStateMessage;
