import React, { useEffect, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import Card from "@/components/others/Card"; // Asegúrate de que la ruta sea correcta

interface Asistencia {
  id_asistencia: number;
  // id: number;
  fe_asistencia: string;
  id_persona: number | null;
}

export default function Home() {
  const URL = "http://insiemp.com:3000";
  // const URL = "http://192.168.20.129:3000";
  const [data, setData] = useState<Asistencia[]>([]); // Estado para los registros de asistencia
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [dbName, setDbName] = useState("");

  useEffect(() => {
    // Función para obtener los registros desde el endpoint
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${URL}/get`);
        const result: Asistencia[] = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      } finally {
        setLoading(false);
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
    <>
      <Stack.Screen options={{ title: "Listado", headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.title}>Registros de Asistencia</Text>
        {data.length === 0 ? (
          <Text>No hay registros disponibles.</Text>
        ) : (
          <FlatList
            data={data}
            // keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                id={item.id_asistencia}
                fe_fecha={item.fe_asistencia}
                usuario_id={item.id_persona}
              />
            )}
          />
        )}
      </View>
    </>
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
});
