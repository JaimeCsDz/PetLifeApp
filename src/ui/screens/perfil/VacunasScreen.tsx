import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Alert, FlatList, Modal } from "react-native";
import { Card, Text, Button, Portal, Provider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchVacunasById } from "../../../actions/vacunas/vacunas";
import { useAuthStore } from "../../../store/useAuthStore";
import { IVacunas } from "../../../interfaces/vacunas/IVacunas";

export const VacunasScreen = () => {
    const [vacunas, setVacunas] = useState<IVacunas[]>([]);
    const [showAllVacunas, setShowAllVacunas] = useState(false);
    const { mascotaId } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (mascotaId) {
                    const response = await fetchVacunasById(mascotaId);
                    setVacunas(response);
                } else {
                    console.warn("mascotaId no está disponible. No se realizará la llamada a la API.");
                }
            } catch (error) {
                Alert.alert("Error", "Ocurrió un error al obtener las vacunas.");
            }
        };
    
        if (mascotaId) {
            fetchData();
        }
    }, [mascotaId]);

    const renderVacuna = ({ item }: { item: IVacunas }) => (
        <Card style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.title}>{item.nombreVacuna}</Text>
                <Button 
                    mode="contained" 
                    style={item.idStatus === "Aplicada" ? styles.statusButtonApplied : styles.statusButtonPending} 
                    labelStyle={item.idStatus === "Aplicada" ? styles.statusButtonLabelApplied : styles.statusButtonLabelPending}
                >
                    {item.idStatus}
                </Button>
            </View>
            <View style={styles.rowStart}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#757575" />
                <Text style={styles.subtitle}>Hora de la aplicación: {item.horaAplicacion}</Text>
            </View>
            <View style={styles.rowStart}>
                <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
                <Text style={styles.subtitle}>Fecha de vacuna: {item.fechaAplicacion}</Text>
            </View>
        </Card>
    );

    return (
        <Provider>
            <SafeAreaView>
                {vacunas.slice(0, 5).map((vacuna, index) => (
                    <View key={index}>{renderVacuna({ item: vacuna })}</View>
                ))}

                {vacunas.length > 5 && (
                    <Button 
                        mode="text" 
                        onPress={() => setShowAllVacunas(true)} 
                        style={styles.viewMoreButton}
                    >
                        Ver más
                    </Button>
                )}

                <Portal>
                    <Modal
                        visible={showAllVacunas}
                        onDismiss={() => setShowAllVacunas(false)}
                        animationType="slide"
                        transparent={true}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Todas las Vacunas</Text>
                            <FlatList
                                data={vacunas}
                                renderItem={renderVacuna}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <Button 
                                mode="text" 
                                onPress={() => setShowAllVacunas(false)}
                                style={styles.closeButton}
                            >
                                Cerrar
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </SafeAreaView>
        </Provider>
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
    viewMoreButton: {
        alignSelf: "center",
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        marginTop: 'auto',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    closeButton: {
        alignSelf: "center",
        marginTop: 20,
    },
});
