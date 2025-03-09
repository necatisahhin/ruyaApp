import React from "react";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    position: "relative", // SearchBar için positioning desteği
  },
  backgroundGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
  },
  glowContainer: {
    position: "absolute",
    width: wp("100%"),
    height: hp("60%"),
    top: -hp("10%"),
    alignSelf: "center",
    zIndex: 0,
  },
  glowGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 200,
  },
  // Yeni stiller ekleyelim
  listContentContainer: {
    paddingTop: hp("10%"), // Bu değer RuyaList.tsx içinde dinamik olacak
    paddingBottom: hp("12%"), // TabBar için daha fazla boşluk
  },
  // Aktif filtreler için gösterge
  activeFiltersContainer: {
    position: "absolute",
    // top değeri kaldırıldı - dinamik olarak verilecek
    width: wp("95%"),
    backgroundColor: "rgba(106, 53, 107, 0.8)",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    zIndex: 10,
  },
  activeFiltersText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  clearFiltersButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("3%"),
    borderRadius: 15,
  },
  clearFiltersText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default styles;
