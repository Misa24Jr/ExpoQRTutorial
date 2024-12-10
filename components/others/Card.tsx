// Card.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Definir las propiedades que va a recibir el componente Card
interface CardProps {
  id: number;
  fe_fecha: string;
  usuario_id: number | null; // Asumimos que puede ser un número o null
}

const Card: React.FC<CardProps> = ({ id, fe_fecha, usuario_id }) => {
  return (
    <View style={styles.card}>
      <View style={styles.line}></View>
      <View style={styles.contenText}>
        <Text style={styles.text}>ID: {id}</Text>
        <Text style={styles.text}>Fecha: {fe_fecha}</Text>
        <Text style={styles.text}>
          Usuario ID: {usuario_id ?? "No asignado"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  contenText:{
    width: "95%"
  },
  line:{
    width: 2,
    height: "100%",
    backgroundColor: "#2f4156",
    borderRadius: 8,
  }
});

export default Card;
