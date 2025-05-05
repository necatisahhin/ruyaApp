import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    width: wp("95%"),
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: wp("2.5%"),
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 0,
    position: "absolute",
    zIndex: 900,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: wp("4%"),
  },
  searchIcon: {
    marginRight: wp("2%"),
    color: "#4B0082",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#2D2D7D",
    fontWeight: "500",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(75, 0, 130, 0.1)",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
