import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router"; // Asegúrate de usar el paquete adecuado para tu navegación

interface ButtonProps {
  href: string; // Ruta del enlace
  text: string; // Texto del botón
  isDisabled?: boolean; // Estado de deshabilitación opcional
}

const CustomButton: React.FC<ButtonProps> = ({ href, text, isDisabled = false }) => {
  return (
    <Link href={href} asChild>
      <Pressable
        disabled={isDisabled}
        style={styles.scannerButton}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </Link>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
    scannerButton: {
        width: 250,
        backgroundColor: "#f5efeb",
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
      },
      buttonText: {
        color: "#2f4156",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "ultralight",
      },
});
