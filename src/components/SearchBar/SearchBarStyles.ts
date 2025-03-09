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
    top: hp("10%"), // Bu değeri SearchBar bileşeninde dinamik olarak hesaplayacağız
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: wp("4%"),
  },
  searchIcon: {
    marginRight: wp("2%"),
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#331F38",
  },
  closeButton: {
    padding: 5,
  },
});

export default styles;
