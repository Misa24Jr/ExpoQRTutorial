import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

interface ModalNameProps {
  isVisible: boolean; // Controla la visibilidad del modal
  title: string; // Título del modal
  placeholder?: string; // Placeholder del input
  value: string; // Valor del input
  onChangeText: (text: string) => void; // Manejador del texto del input
  onSave: () => void; // Acción al guardar
}

const ModalName: React.FC<ModalNameProps> = ({
  isVisible,
  title,
  placeholder = "Ingrese texto",
  value,
  onChangeText,
  onSave,
}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={onChangeText}
          />
          <Pressable style={styles.saveButton} onPress={onSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalName;

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
});
