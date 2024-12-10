import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

interface Asistencia {
  id: number;
  fe_fecha: string;
  usuario_id: number | null;
}

export default function Home() {
  const URL = "http://192.168.1.95:3000"
  const [data, setData] = useState<Asistencia[]>([]); // Define el estado con el tipo `Asistencia`
  const [loading, setLoading] = useState<boolean>(true); // Estado para la carga

  useEffect(() => {
    // Función para obtener los registros desde el endpoint
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${URL}/get`); // Cambia la URL por tu endpoint
        const result: Asistencia[] = await response.json(); // Asegúrate de que el resultado sea un arreglo de tipo `Asistencia`
        setData(result);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando registros...</Text>
      </View>
    );
  }

  return (
    <><Stack.Screen options={{ title: "Listado", headerShown: true }} /><View style={styles.container}>
      <Text style={styles.title}>Registros de Asistencia</Text>
      {data.length === 0 ? (
        <Text>No hay registros disponibles.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>ID: {item.id}</Text>
              <Text style={styles.text}>Fecha: {item.fe_fecha}</Text>
              <Text style={styles.text}>Usuario ID: {item.usuario_id ?? "No asignado"}</Text>
            </View>
          )} />
      )}
    </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
  },
});
