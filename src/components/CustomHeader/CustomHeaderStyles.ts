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
    backgroundColor: "#2C2C6C",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
    paddingHorizontal: wp("4%"),
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  leftButton: {
    width: hp("5%"),
    height: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
    borderRadius: hp("2.5%"),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    borderRadius: hp("2.5%"),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default styles;
