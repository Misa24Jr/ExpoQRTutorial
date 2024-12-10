import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
// Componentes personalizados
import CustomButton from "@/components/CustomButton";
import Message from "../components/MessageBar";
import ModalName from "@/components/ModalName";
import DeleteModal from "@/components/DeleteModal";
import Loading from "@/components/loading";

export default function Home() {
  const URL = "http://192.168.1.95:3000";
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [dbName, setDbName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        await fetch(`${URL}/configurar-base-datos`, {
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
  const handleDeleteDbName = () => setDeleteModalVisible(true);

  const handleDeleteConfirm = async (deleteKey: string) => {
    if (deleteKey === "1234") {
      setIsLoading(true);
      try {
        await AsyncStorage.removeItem("dbName");
        await fetch(`${URL}/limpiar-base-datos`, {
          method: "POST",
        });
  
        setDbName("");
        setDeleteModalVisible(false);
        setModalVisible(true);
        showMessage("Nombre eliminado con exito", "success");
      } catch (error) {
        console.error("Error deleting dbName:", error);
        showMessage("Error al eliminar el nombre", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showMessage("Clave incorrecta", "error");
      console.log("Enviado al backend: ", deleteKey);
    }
  };
  

  const handleCancel = () => {
    setDeleteModalVisible(false);
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
        <CustomButton
          href="/scanner"
          text="Escanear"
          isDisabled={!isPermissionGranted}
        />
        <CustomButton
          href="/list"
          text="Listado"
          isDisabled={!isPermissionGranted}
        />
        <Pressable style={styles.deleteButton} onPress={handleDeleteDbName}>
          <Text style={styles.deleteButtonText}>Eliminar dispositivo</Text>
        </Pressable>
      </View>

      <ModalName
        isVisible={isModalVisible}
        title="Ingresa el nombre del dispositivo"
        placeholder="Nombre"
        value={dbName}
        onChangeText={setDbName}
        onSave={handleSaveDbName}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        onDeleteConfirm={handleDeleteConfirm}
        onCancel={handleCancel}
        errorMessage={errorMessage}
      />
      <Loading isVisible={isLoading} />
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
  },
  btnContainer: {
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#f5efeb",
    borderColor: "#2f4156",
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
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
});
