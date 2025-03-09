import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp("95%"),
    marginVertical: hp("2%"),
    borderRadius: 16,
    backgroundColor: "transparent", // Arka plan şeffaf olacak gradient için
    shadowColor: "#8D5E8E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    overflow: "hidden", // Menü kart içinde olacağından overflow hidden olmalı
  },
  cardContent: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "transparent", // Gradient kullanacağımız için şeffaf yapıyoruz
    overflow: "hidden", // İçerideki gradientler için
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 16,
  },
  contentContainer: {
    padding: wp("4%"),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "transparent", // Şeffaf olacak gradient görünsün diye
  },
  headerContainer: {
    marginBottom: hp("0.5%"),
    justifyContent: "space-between",
    flexDirection: "row",
    zIndex: 2, // İçerik öne çıksın
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    zIndex: 2, // İçerik öne çıksın
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FFFFFF", // Beyaz metin
    marginRight: wp("2%"),
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Metin gölgesi
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  category: {
    fontSize: 14,
    color: "#FFD700", // Altın rengi vurgu
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 12,
    overflow: "hidden",
    marginLeft: wp("2%"),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  chevronContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: wp("0.60%"),
    borderRadius: 50,
    height: hp("4.5%"),
    width: hp("4.5%"),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 5,
  },
  // Yıldız ve parlama efektleri ile ilgili stiller kaldırıldı
  descriptionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Şeffaf arka plan
    padding: wp("3%"),
    borderRadius: 12,
    marginVertical: hp("1%"),
    zIndex: 2, // İçerik öne çıksın
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  description: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FFFFFF", // Beyaz metin
    lineHeight: 22,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 3,
  },
  dateContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: hp("1%"),
    zIndex: 2, // İçerik öne çıksın
  },
  date: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)", // Beyaz ama şeffaf
    fontStyle: "italic",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },

  // Yorum göstergesi için yeni stil
  interpretationIndicator: {
    marginLeft: wp("2%"),
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    borderRadius: 12,
    padding: wp("1%"),
  },

  // Yorum alanı için stiller
  interpretationContainer: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  interpretationGradient: {
    padding: wp("4%"),
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  interpretationHeaderContainer: {
    alignItems: "center",
    paddingBottom: hp("1%"),
    marginBottom: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  interpretationHeaderLine: {
    width: wp("10%"),
    height: 4,
    backgroundColor: "rgba(255, 215, 0, 0.5)",
    borderRadius: 2,
    marginBottom: 6,
  },
  interpretationHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  interpretationText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  fullInterpretationButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: hp("1%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("2%"),
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderRadius: 12,
  },
  fullInterpretationButtonText: {
    fontSize: 12,
    color: "#FFD700",
    marginRight: wp("1%"),
    fontWeight: "600",
  },

  // Yeni entegre menü tasarım stilleri
  menuContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Daha şeffaf arka plan
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
    backdropFilter: "blur(5px)", // Arka planı bulanıklaştırma
  },
  menuGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    opacity: 0.7,
  },
  gradientContent: {
    width: 600,
    height: "100%",
  },
  menuHeader: {
    alignItems: "center",
    paddingVertical: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)", // Şeffaf beyaz çizgi
    backgroundColor: "rgba(255, 255, 255, 0.07)", // Hafif şeffaf beyaz
  },
  menuHeaderLine: {
    width: wp("12%"),
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Şeffaf beyaz çizgi
    borderRadius: 5,
    marginBottom: 5,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF", // Beyaz metin
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  menuContent: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "rgba(255, 255, 255, 0.03)", // Çok hafif şeffaf beyaz
  },
  menuItemContainer: {
    alignItems: "center",
    width: wp("25%"),
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF", // Beyaz metin
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
});

export default styles;
