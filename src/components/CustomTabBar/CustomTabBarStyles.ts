import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp("10%"),
    width: wp("95%"),
    marginHorizontal: wp("2.5%"),
    backgroundColor: "#2C2C6C",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 20,
    paddingHorizontal: wp("4%"),
    position: "absolute",
    bottom: 6,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    height: hp("7%"),
    width: hp("7%"),
    borderRadius: hp("3.5%"),
    position: "relative",
  },
  activeTabButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  middleTabButton: {
    height: hp("9%"),
    width: hp("9%"),
    borderRadius: hp("4.5%"),
    backgroundColor: "#FF5252",
    transform: [{ translateY: -hp("2.5%") }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconMiddle: {
    transform: [{ scale: 1.2 }],
  },
  tabLabel: {
    color: "white",
    fontSize: 10,
    marginTop: 2,
    fontWeight: "600",
  },
  highlightEffect: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: hp("3.5%"),
    opacity: 0,
  },
});

export default styles;
