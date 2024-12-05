import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface MessageProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  onHide: () => void;
}

const Message: React.FC<MessageProps> = ({ message, type, visible, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Animación para mostrar el mensaje
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Ocultar después de 3 segundos
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(onHide);
        }, 10000);
      });
    }
  }, [visible]);

  if (!visible) return null;

  const backgroundColor =
    type === "success"
      ? "#4CAF50"
      : type === "error"
      ? "#F44336"
      : "#2196F3";

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, opacity: fadeAnim },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // bottom: 20,
    top: "5%",
    left: "10%",
    right: "10%",
    padding: 15,
    borderRadius: 10,
    zIndex: 1000,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Message;
