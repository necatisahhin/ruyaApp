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
    padding: wp("5%"),
  },
  text: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "500",
    backgroundColor: "rgba(106, 53, 107, 0.7)",
    padding: wp("5%"),
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default styles;
