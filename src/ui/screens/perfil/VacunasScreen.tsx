import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Alert } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchVacunasById } from "../../../actions/vacunas/vacunas";
import { useAuthStore } from "../../../store/useAuthStore";
import { IVacunas } from "../../../interfaces/vacunas/IVacunas";

export const VacunasScreen = () => {
    const [vacunas, setVacunas] = useState<IVacunas[]>([]);
    const { mascotaId } = useAuthStore();
    console.log("mascotaId:", mascotaId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (mascotaId) {
                    const response = await fetchVacunasById(mascotaId);
                    setVacunas(response);
                } else {
                    console.warn("mascotaId no está disponible. No se realizará la llamada a la API.");
                    // Puedes mostrar una alerta o manejar el caso donde no hay mascota seleccionada
                }
            } catch (error) {
                Alert.alert("Error", "Ocurrió un error al obtener las vacunas.");
            }
        };
    
        if (mascotaId) {
            fetchData();
        }
    }, [mascotaId]);
    

    const getStatusStyles = (idStatus: string) => {
        switch (idStatus) {
            case "Aplicada":
                return {
                    buttonStyle: styles.statusButtonApplied,
                    labelStyle: styles.statusButtonLabelApplied,
                };
            case "Pendiente":
                return {
                    buttonStyle: styles.statusButtonPending,
                    labelStyle: styles.statusButtonLabelPending,
                };
            case "Cancelada":
                return {
                    buttonStyle: styles.statusButtonPending,
                    labelStyle: styles.statusButtonLabelPending,
                };
        }
    };

    return (
        <SafeAreaView>
            {vacunas.length > 0 ? (
                vacunas.map((vacuna, index) => (
                    <Card key={index} style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.title}>{vacuna.nombreVacuna}</Text>
                            <Button 
                                mode="contained" 
                                style={vacuna.idStatus === "Aplicada" ? styles.statusButtonApplied : styles.statusButtonPending} 
                                labelStyle={vacuna.idStatus === "Aplicada" ? styles.statusButtonLabelApplied : styles.statusButtonLabelPending}
                            >
                                {vacuna.idStatus}
                            </Button>
                        </View>
                        <View style={styles.rowStart}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color="#757575" />
                            <Text style={styles.subtitle}>Hora de la aplicación: {vacuna.horaAplicacion}</Text>
                        </View>
                        <View style={styles.rowStart}>
                            <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
                            <Text style={styles.subtitle}>Fecha de vacuna: {vacuna.fechaAplicacion}</Text>
                        </View>
                    </Card>
                ))
            ) : (
                <Text style={styles.noDataText}>No se encontraron vacunas registradas.</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        padding: 15,
        backgroundColor: "#fff",
        elevation: 3,
        marginBottom: 20,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    rowStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 14,
        color: "#757575",
        marginLeft: 5, 
    },
    statusButtonApplied: {
        backgroundColor: "#E0F8DC",
        borderRadius: 15,
        elevation: 0,
        width: 90,
    },
    statusButtonPending: {
        backgroundColor: "#FDECEC",
        borderRadius: 15,
        elevation: 0,
        width: 90,
    },
    statusButtonLabelApplied: {
        color: "#64B169",
        fontSize: 10,
        fontWeight: "bold",
    },
    statusButtonLabelPending: {
        color: "#E57373",
        fontSize: 10,
        fontWeight: "bold",
    },
    noDataText: {
        textAlign: "center",
        color: "#757575",
        marginTop: 20,
        fontSize: 16,
    },
});
