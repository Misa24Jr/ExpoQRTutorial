import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";

interface DeleteModalProps {
  isVisible: boolean; // Controla la visibilidad del modal
  onDeleteConfirm: (deleteKey: string) => void; // Acción al confirmar la eliminación
  onCancel: () => void; // Acción al cancelar
  errorMessage?: string; // Mensaje de error, si existe
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isVisible,
  onDeleteConfirm,
  onCancel,
  errorMessage,
}) => {
  const [deleteKey, setDeleteKey] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0)); // Para la animación del mensaje de error

  useEffect(() => {
    if (errorMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [errorMessage, fadeAnim]);

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ingresa la clave para eliminar</Text>
          <TextInput
            style={styles.input}
            placeholder="Código"
            placeholderTextColor="#aaa"
            value={deleteKey}
            onChangeText={(text) => {
              console.log("Input value:", text); // Esto debería mostrar el valor actual del input
              setDeleteKey(text);
            }}
            secureTextEntry
          />

          {errorMessage && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </Animated.View>
          )}
          <Pressable
            style={styles.saveButton}
            onPress={() => {
              console.log("Delete key sent:", deleteKey); // Esto debería mostrar el valor antes de enviarlo
              onDeleteConfirm(deleteKey);
            }}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </Pressable>
          <Pressable
            style={[styles.saveButton, { backgroundColor: "#ccc" }]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
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
  errorMessage: { color: "red", textAlign: "center", marginTop: 10 },
});
