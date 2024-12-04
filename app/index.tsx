import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-camera";
import { Link, Stack } from "expo-router";
import { sub } from "@shopify/react-native-skia";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const [dbName, setDbName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // Modal para clave
  const [deleteKey, setDeleteKey] = useState(""); // Clave para eliminar
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de desvanecimiento

  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    const checkDbName = async () => {
      const storedDbName = await AsyncStorage.getItem("dbName");
      if (!storedDbName) {
        setModalVisible(true);
      }
    };
    checkDbName();
  }, []);

  const handleSaveDbName = async () => {
    if (dbName) {
      try {
        await AsyncStorage.setItem("dbName", dbName);

        // Enviar el nombre al backend
        await fetch("http://192.168.1.95:3000/set-db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dbName }),
        });

        setModalVisible(false);
      } catch (error) {
        console.error("Error saving dbName:", error);
      }
    }
  };

  const handleDeleteDbName = async () => {
    setDeleteModalVisible(true); 
  };

  const handleDeleteConfirm = async () => {
    if (deleteKey === "0000") {
      try {
        // Eliminar el nombre de la base de datos de AsyncStorage
        await AsyncStorage.removeItem("dbName");

        // También puedes enviar al backend si necesitas restablecer la conexión
        await fetch("http://192.168.1.95:3000/set-db", {
          method: "POST",
        });

        setDbName(""); // Limpiar el estado del nombre de la base de datos
        alert("Nombre de la base de datos eliminado y conexión restablecida.");
        setDeleteModalVisible(false); // Cerrar el modal
      } catch (error) {
        console.error("Error deleting dbName:", error);
        alert("Error al eliminar el nombre de la base de datos.");
      }
    } else {
      setErrorMessage(
        "La clave es incorrecta. No se puede eliminar el nombre de la base de datos."
      );
      // Iniciar animación de desvanecimiento del mensaje de error
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Ocultar el mensaje de error después de 3 segundos
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
        setErrorMessage(""); // Limpiar el mensaje después de la animación
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>INSIEMPCA</Text>
        <Text style={styles.subtitle}>Lector QR</Text>
      </View>

      <View style={styles.btnContainer}>
        <Pressable onPress={requestPermission} style={styles.deleteButton}>
          <Text style={styles.buttonStyle}>Requerir Permisos</Text>
        </Pressable>
        <Link href={"/scanner"} asChild>
          <Pressable disabled={!isPermissionGranted} style={styles.deleteButton} >
            <Text
              style={[
                styles.buttonStyle,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              Escanear
            </Text>
          </Pressable>
        </Link>

        <Pressable style={styles.deleteButton} onPress={handleDeleteDbName}>
          <Text style={styles.buttonText}>Eliminar Base de Datos</Text>
        </Pressable>
      </View>


      {/* Modal para ingresar el nombre de la base de datos */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Ingresa el nombre de la base de datos
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la base de datos"
              placeholderTextColor="#aaa"
              value={dbName}
              onChangeText={setDbName}
            />
            <Pressable style={styles.saveButton} onPress={handleSaveDbName}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal para ingresar la clave de eliminación */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Ingresa la clave para eliminar
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Codigo de eliminación"
              placeholderTextColor="#aaa"
              value={deleteKey}
              onChangeText={setDeleteKey}
              secureTextEntry
            />
            {/* Animación de desvanecimiento para el mensaje de error */}
            {errorMessage ? (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </Animated.View>
            ) : null}
            <Pressable style={styles.saveButton} onPress={handleDeleteConfirm}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, { backgroundColor: "#ccc" }]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#c8d9e6",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: { color: "#2f4156", fontSize: 40 },
  subtitle: { color: "#2f4156", fontSize: 20 },
  buttonStyle: {
    color: "#567c8d",
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  titleContainer:{
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue"
  },
  btnContainer:{
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red"
  },
  // Estilos para los modales
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  saveButton: { backgroundColor: "#0E7AFE", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", textAlign: "center", fontSize: 16 },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  errorMessage: { color: "red", textAlign: "center", marginTop: 10 },
});
