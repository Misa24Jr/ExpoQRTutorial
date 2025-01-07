import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { Overlay } from "./Overlay";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function Home() {
  const URL = "http://insiemp.com:3000";
  // const URL = "http://192.168.1.95:3000";
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [qrData, setQrData] = useState(""); // Estado para guardar el contenido del QR
  const translateY = useSharedValue(100); // Valor inicial para ocultar el mensaje

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarcodeScanned = async (data: SetStateAction<string>) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      setQrData(data); // Guarda el contenido del QR
      translateY.value = withTiming(0, { duration: 500 }); // Sube el mensaje con animacion

      // Realiza el fetch al backend
      try {
        const response = await fetch(`${URL}/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_persona: data }),
        });

        if (response.ok) {
          console.log("Registro creado exitosamente");
        } else {
          console.error("Error al registrar el QR:", await response.text());
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }

      setTimeout(() => {
        translateY.value = withTiming(100, { duration: 500 }); // Baja el mensaje con animaci�n
        setTimeout(() => {
          setQrData(""); // Limpia el mensaje despu�s de la animaci�n
          qrLock.current = false; // Desbloquea para nuevos escaneos
        }, 500);
      }, 3000);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="front"
        onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
      />
      <Overlay />
      <Animated.View style={[styles.qrContainer, animatedStyle]}>
        <Text style={styles.qrText}>
          {qrData ? `Alumno: ${qrData}` : ""}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#2f4156",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
    transform: [{ translateY: 100 }],
  },
  qrText: {
    color: "#f5efeb",
    fontSize: 16,
    textAlign: "center",
  },
});
