import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingProps {
  isVisible: boolean; // Para controlar si el loading debe ser visible o no
}

const Loading: React.FC<LoadingProps> = ({ isVisible }) => {
  if (!isVisible) return null; // No renderiza nada si isVisible es false

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
});
