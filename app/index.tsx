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
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-camera";
import { Link, Stack } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Message from "../components/MessageBar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [dbName, setDbName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteKey, setDeleteKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  const [message, setMessage] = useState({
    text: "",
    type: "info",
    visible: false,
  });

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type, visible: true });
  };

  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    const checkDbName = async () => {
      const storedDbName = await AsyncStorage.getItem("dbName");
      if (!storedDbName) {
        setModalVisible(true);
      }
    };
    checkDbName();
  }, [dbName]); // Escuchar cambios en dbName
  

  const handleSaveDbName = async () => {
    if (dbName) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem("dbName", dbName);
        await fetch("http://192.168.1.95:3000/configurar-base-datos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dbName }),
        });
        setModalVisible(false);
        showMessage("Nombre guardado con exito", "success");
      } catch (error) {
        console.error("Error saving dbName:", error);
        showMessage("Error al guardar el nombre", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showMessage("Por favor, ingresa un nombre", "error");
    }
  };

  const handleConsole = () => {
    console.log("Hola mundo");
  };

  const handleDeleteDbName = () => setDeleteModalVisible(true);

  const handleDeleteConfirm = async () => {
    if (deleteKey === "0000") {
      setIsLoading(true);
      try {
        await AsyncStorage.removeItem("dbName"); // Elimina el nombre
        await fetch("http://192.168.1.95:3000/limpiar-base-datos", {
          method: "POST",
        });
  
        setDbName(""); // Limpia el estado local
        setDeleteModalVisible(false); // Cierra el modal de eliminación
        setModalVisible(true); // Abre el modal para ingresar el nombre
        showMessage("Nombre eliminado con exito", "success");
      } catch (error) {
        console.error("Error deleting dbName:", error);
        showMessage("Error al eliminar el nombre", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showMessage("Clave incorrecta", "error");
    }
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <View style={styles.titleContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={require("../assets/images/icon.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text style={styles.title}>INSIEMPCA</Text>
        </View>
        <Text style={styles.subtitle}>Bienvenido a QRLector</Text>
        <Pressable onPress={requestPermission} style={{ paddingTop: 10 }}>
          <Text style={{ color: "gray", fontSize: 16 }}>Requerir Permisos</Text>
        </Pressable>
      </View>

      <View style={styles.btnContainer}>
        <Link href={"/scanner"} asChild>
          <Pressable
            disabled={!isPermissionGranted}
            style={styles.scannerButton}

          >
            <Text
              style={[
                styles.buttonText,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              Escanear
            </Text>
          </Pressable>
        </Link>
        <Pressable style={styles.deleteButton} onPress={handleDeleteDbName}>
          <Text style={styles.deleteButtonText}>Eliminar dispositivo</Text>
        </Pressable>
      </View>

      {/* Modal para ingresar el nombre de la base de datos */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Ingresa el nombre del dispositivo
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
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

      {/* Modal para eliminar la base de datos */}
      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Ingresa la clave para eliminar
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Codigo"
              placeholderTextColor="#aaa"
              value={deleteKey}
              onChangeText={setDeleteKey}
              secureTextEntry
            />
            {errorMessage && (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </Animated.View>
            )}
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

      {/* Indicador de carga */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      <Icon name="qr-code" size={100} color="#FFFFFF" />

      <Message
        message={message.text}
        type={message.type as "success" | "error" | "info"}
        visible={message.visible}
        onHide={() => setMessage({ ...message, visible: false })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2f4156",
    justifyContent: "space-around",
    paddingVertical: 60,
  },
  title: { color: "#FFFFFF", fontSize: 55 },
  subtitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "bold" },

  titleContainer: {
    width: "70%",
    height: "40%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "blue"
  },
  btnContainer: {
    width: "100%",
    height: "60%",
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
    backgroundColor: "#f5efeb",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
    color: "#2f4156",
  },

  input: {
    borderWidth: 1,
    borderColor: "#2f4156",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#f5efeb",
    borderColor: "#2f4156",
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: "#2f4156",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "ultralight",
  },
  deleteButtonText: {
    color: "#f5efeb",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "ultralight",
  },
  deleteButton: {
    width: 250,
    backgroundColor: "#2f4156",
    borderColor: "#f5efeb",
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  scannerButton: {
    width: 250,
    backgroundColor: "#f5efeb",
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  errorMessage: { color: "red", textAlign: "center", marginTop: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
