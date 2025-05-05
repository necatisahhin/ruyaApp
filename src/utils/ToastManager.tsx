import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


export type ToastType = "success" | "error" | "info" | "warning";


export type ToastPosition = "top" | "bottom";


export interface ToastButton {
  text: string;
  onPress: () => void;
  style?: "primary" | "secondary";
}


interface ToastOptions {
  message: string;
  duration?: number;
  position?: ToastPosition;
  type?: ToastType;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  buttons?: ToastButton[];
  onHide?: () => void;
}


interface ToastItem extends ToastOptions {
  id: number;
  startTime: number;
  remainingDuration: number;
  height?: number; 
}


class ToastManagerClass {
  private static instance: ToastManagerClass;
  private toasts: ToastItem[] = [];
  private listeners: Set<(toasts: ToastItem[]) => void> = new Set();
  private lastId = 0;
  private timeoutRefs: Record<number, NodeJS.Timeout> = {};

  
  static getInstance() {
    if (!this.instance) {
      this.instance = new ToastManagerClass();
    }
    return this.instance;
  }

  
  show(options: ToastOptions): number {
    const id = ++this.lastId;
    const defaultDuration = options.buttons?.length ? 60000 : 3000;

    const newToast: ToastItem = {
      id,
      message: options.message,
      type: options.type || "info",
      position: options.position || "top",
      duration: options.duration || defaultDuration,
      icon: options.icon,
      iconColor: options.iconColor,
      buttons: options.buttons || [],
      onHide: options.onHide,
      startTime: Date.now(),
      remainingDuration: options.duration || defaultDuration,
    };

    this.toasts = [...this.toasts, newToast];
    this.notifyListeners();

    
    if (!options.buttons?.length) {
      this.setHideTimeout(id, newToast.duration);
    }

    return id;
  }

  
  hide(id: number) {
    const toastToHide = this.toasts.find((toast) => toast.id === id);
    if (toastToHide?.onHide) {
      toastToHide.onHide();
    }

    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notifyListeners();

    
    if (this.timeoutRefs[id]) {
      clearTimeout(this.timeoutRefs[id]);
      delete this.timeoutRefs[id];
    }
  }

  
  hideAll() {
    
    Object.keys(this.timeoutRefs).forEach((id) => {
      clearTimeout(this.timeoutRefs[Number(id)]);
      delete this.timeoutRefs[Number(id)];
    });

    this.toasts.forEach((toast) => {
      if (toast.onHide) toast.onHide();
    });

    this.toasts = [];
    this.notifyListeners();
  }

  
  subscribe(callback: (toasts: ToastItem[]) => void) {
    this.listeners.add(callback);
    callback(this.toasts); 

    return () => {
      this.listeners.delete(callback);
    };
  }

  
  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  
  private setHideTimeout(id: number, duration: number) {
    this.timeoutRefs[id] = setTimeout(() => {
      this.hide(id);
    }, duration);
  }

  
  pauseToast(id: number) {
    const toast = this.toasts.find((t) => t.id === id);
    if (!toast || toast.buttons?.length) return; 

    const elapsedTime = Date.now() - toast.startTime;
    toast.remainingDuration = Math.max(0, toast.duration - elapsedTime);

    
    if (this.timeoutRefs[id]) {
      clearTimeout(this.timeoutRefs[id]);
      delete this.timeoutRefs[id];
    }
  }

  
  resumeToast(id: number) {
    const toast = this.toasts.find((t) => t.id === id);
    if (!toast || toast.buttons?.length) return; 

    toast.startTime = Date.now();

    
    this.setHideTimeout(id, toast.remainingDuration);
  }

  
  updateToastHeight(id: number, height: number) {
    const toastIndex = this.toasts.findIndex((t) => t.id === id);
    if (toastIndex !== -1) {
      this.toasts[toastIndex].height = height;
      this.notifyListeners();
    }
  }
}


export const ToastManager = ToastManagerClass.getInstance();


export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { width } = Dimensions.get("window");

  
  const safeTopMargin = Platform.OS === "ios" ? 50 : 20;
  const safeBottomMargin = Platform.OS === "ios" ? 34 : 10;

  
  const toastRefs = useRef<{ [id: number]: View | null }>({});

  
  useEffect(() => {
    return ToastManager.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });
  }, []);

  
  const getIconColor = (type: ToastType, customColor?: string) => {
    if (customColor) return customColor;

    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
      default:
        return "#2196F3";
    }
  };

  
  const getIcon = (
    type: ToastType,
    customIcon?: keyof typeof Ionicons.glyphMap
  ): keyof typeof Ionicons.glyphMap => {
    if (customIcon) return customIcon;

    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "warning":
        return "warning";
      case "info":
      default:
        return "information-circle";
    }
  };

  
  const animatedValues = useRef<{ [id: number]: Animated.Value }>({});

  
  const getAnimatedValue = (id: number) => {
    if (!animatedValues.current[id]) {
      animatedValues.current[id] = new Animated.Value(0);

      
      Animated.timing(animatedValues.current[id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    return animatedValues.current[id];
  };

  
  const handleCloseToast = (id: number) => {
    const animValue = animatedValues.current[id];

    if (animValue) {
      
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        ToastManager.hide(id);
        delete animatedValues.current[id];
      });
    } else {
      ToastManager.hide(id);
    }
  };

  
  const handleButtonPress = (toast: ToastItem, buttonPress: () => void) => {
    buttonPress();
    handleCloseToast(toast.id);
  };

  
  const handleToastLayout = (id: number, event: any) => {
    const { height } = event.nativeEvent.layout;
    ToastManager.updateToastHeight(id, height);
  };

  
  const topToasts = toasts.filter((toast) => toast.position === "top");
  const bottomToasts = toasts.filter((toast) => toast.position === "bottom");

  
  const calculateToastPosition = (
    toast: ToastItem,
    index: number,
    position: "top" | "bottom"
  ): number => {
    const positionToasts = position === "top" ? topToasts : bottomToasts;
    let offset = position === "top" ? safeTopMargin : safeBottomMargin;

    
    for (let i = 0; i < index; i++) {
      const prevToast = positionToasts[i];
      offset += (prevToast.height || 60) + 10; 
    }

    return offset;
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Üstteki toast'lar */}
      {topToasts.map((toast, index) => {
        const animValue = getAnimatedValue(toast.id);
        const position = calculateToastPosition(toast, index, "top");

        
        const containerStyle = [
          styles.toastContainer,
          { width: width - 20 },
          {
            top: position,
            transform: [
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0],
                }),
              },
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: animValue,
          },
        ];

        return (
          <Animated.View
            key={toast.id}
            style={containerStyle}
            pointerEvents="box-none"
            ref={(ref) => {
              toastRefs.current[toast.id] = ref;
            }}
            onLayout={(event) => handleToastLayout(toast.id, event)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={getIcon(toast.type, toast.icon)}
                size={24}
                color={getIconColor(toast.type, toast.iconColor)}
              />
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.messageText}>{toast.message}</Text>

              {toast.buttons && toast.buttons.length > 0 && (
                <View style={styles.buttonsContainer}>
                  {toast.buttons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.buttonBase,
                        button.style === "secondary"
                          ? styles.secondaryButton
                          : styles.primaryButton,
                      ]}
                      onPress={() => handleButtonPress(toast, button.onPress)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          button.style === "secondary"
                            ? styles.secondaryButtonText
                            : styles.primaryButtonText,
                        ]}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleCloseToast(toast.id)}
            >
              <Ionicons name="close" size={20} color="#757575" />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Alttaki toast'lar */}
      {bottomToasts.map((toast, index) => {
        const animValue = getAnimatedValue(toast.id);
        const position = calculateToastPosition(toast, index, "bottom");

        
        const containerStyle = [
          styles.toastContainer,
          { width: width - 20 },
          {
            bottom: position,
            transform: [
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: animValue,
          },
        ];

        return (
          <Animated.View
            key={toast.id}
            style={containerStyle}
            pointerEvents="box-none"
            ref={(ref) => {
              toastRefs.current[toast.id] = ref;
            }}
            onLayout={(event) => handleToastLayout(toast.id, event)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={getIcon(toast.type, toast.icon)}
                size={24}
                color={getIconColor(toast.type, toast.iconColor)}
              />
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.messageText}>{toast.message}</Text>

              {toast.buttons && toast.buttons.length > 0 && (
                <View style={styles.buttonsContainer}>
                  {toast.buttons.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.buttonBase,
                        button.style === "secondary"
                          ? styles.secondaryButton
                          : styles.primaryButton,
                      ]}
                      onPress={() => handleButtonPress(toast, button.onPress)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          button.style === "secondary"
                            ? styles.secondaryButtonText
                            : styles.primaryButtonText,
                        ]}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleCloseToast(toast.id)}
            >
              <Ionicons name="close" size={20} color="#757575" />
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};


const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 12,
    minHeight: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 9999,
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  messageText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  buttonBase: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: "#6A356B",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6A356B",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#6A356B",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
