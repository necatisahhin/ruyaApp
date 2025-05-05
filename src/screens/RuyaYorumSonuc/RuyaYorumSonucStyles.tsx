import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#1E1A33", 
  },
  mainScrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: hp("10%"),
    paddingBottom: hp("15%"),
    alignItems: "center",
  },

  
  backgroundGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  glowEffect: {
    position: "absolute",
    width: wp("150%"),
    height: hp("50%"),
    top: -hp("25%"),
    alignSelf: "center",
    opacity: 0.6,
    zIndex: 0,
  },

  
  headerSection: {
    width: wp("90%"),
    marginBottom: hp("3%"),
    alignItems: "center",
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: hp("1%"),
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
    flexWrap: "wrap",
  },
  categoryChip: {
    backgroundColor: "#FFB74D",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 20,
    marginRight: wp("2%"),
  },
  categoryChipText: {
    color: "#7A2C9E",
    fontWeight: "700",
    fontSize: 14,
  },
  dateChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 20,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontStyle: "italic",
  },

  
  contentSection: {
    width: wp("90%"),
    marginBottom: hp("2.5%"),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFB74D",
    marginBottom: hp("1.5%"),
  },
  dreamContent: {
    backgroundColor: "rgba(255, 255, 255, 0.07)", 
    borderRadius: 16,
    padding: wp("5%"),
    overflow: "hidden",
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
  },

  
  interpretationSection: {
    width: wp("90%"),
    marginBottom: hp("2.5%"),
  },
  interpretationContent: {
    backgroundColor: "rgba(255, 255, 255, 0.07)", 
    borderRadius: 16,
    padding: wp("5%"),
    overflow: "hidden",
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
  },

  
  actionButtonsContainer: {
    width: wp("90%"),
    marginTop: hp("2%"),
  },
  actionButton: {
    width: "100%",
    height: hp("6%"),
    marginBottom: hp("2%"),
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: wp("2%"),
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: wp("2%"),
  },

  
  backButtonContainer: {
    position: "absolute",
    top: hp("5%"),
    left: wp("5%"),
    zIndex: 1000, 
  },
  backButton: {
    width: 45, 
    height: 45, 
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonInner: {
    width: 40,
    height: 40,
    backgroundColor: "#FFB74D",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default styles;
