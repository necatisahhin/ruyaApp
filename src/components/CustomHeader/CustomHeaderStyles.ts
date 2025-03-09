import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp("8%"),
    width: wp("95%"),
    marginHorizontal: wp("2.5%"),
    backgroundColor: "#6A356B",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    paddingHorizontal: wp("4%"),
    // Absolute pozisyon güncelleniyor - top değeri dinamik olarak eklenecek
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1000, // Diğer bileşenlerin üzerinde görünmesi için
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  leftButton: {
    width: hp("5%"),
    height: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },
  rightButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: wp("2%"),
  },
  rightButton: {
    width: hp("5%"),
    height: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp("1%"),
  },
});

export default styles;
