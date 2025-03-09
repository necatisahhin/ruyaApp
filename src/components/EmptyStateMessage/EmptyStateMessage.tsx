import React from "react";
import { View, Text } from "react-native";
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
  // Özel mesaj verilmişse onu kullan,
  // yoksa duruma göre favori mesajı veya genel mesaj göster
  const message = customMessage
    ? customMessage
    : showFavorites
    ? "Hiç bir favori rüyanız yok eklemeye başlayın"
    : "Henüz hiç rüya eklenmemiş";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default EmptyStateMessage;
