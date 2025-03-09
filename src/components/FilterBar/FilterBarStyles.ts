import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    width: wp("95%"),
    backgroundColor: "#F6F0F9",
    marginHorizontal: wp("2.5%"),
    borderRadius: 15,
    overflow: "hidden",
    // Sabit değer yerine hesaplanan değer kullanılacak
    marginTop: 0,
    position: "absolute",
    zIndex: 900,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Top değeri dinamik olarak ayarlanacak
    top: hp("10%"), // Bu değeri FilterBar bileşeninde dinamik olarak hesaplayacağız
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: wp("4%"),
    justifyContent: "space-between",
  },
  filterIcon: {
    marginRight: wp("2%"),
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp("3%"),
    marginBottom: hp("1%"),
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#331F38",
    marginLeft: wp("1%"),
  },
  closeButton: {
    padding: 5,
  },
  // Kategori başlığını bir container içinde düzenleyip
  // tıklanabilir hale getirmek için yeni stil
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp("1%"),
    marginBottom: hp("0.5%"),
    paddingVertical: hp("0.5%"),
    width: "100%",
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6A356B",
    marginRight: wp("1%"),
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: hp("0.5%"),
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp("3%"),
    marginBottom: hp("0.8%"),
  },
  categoryLabel: {
    fontSize: 14,
    color: "#331F38",
    marginLeft: wp("1%"),
  },
});

export default styles;
