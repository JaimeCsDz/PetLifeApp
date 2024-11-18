import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, FlatList, Text, TouchableOpacity, ScrollView } from "react-native";
import { Card, Button, Portal, Provider, Modal } from "react-native-paper";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { fetchVacunasById, getEstatus } from "../../../actions/vacunas/vacunas";
import { useAuthStore } from "../../../store/useAuthStore";
import { IEstatus } from "../../../interfaces/vacunas/IEstatus";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { IVacunas } from "../../../interfaces/vacunas/IVacunas";
import { deleteVacuna, getMascotasByUserId } from "../../../actions/profile/profile";
import { VacunaModal } from "./VacunasModal";
import { IMascotas } from '../../../interfaces/Mascota/IMascota';

export const VacunasScreen = ({ showAllVacunas, setShowAllVacunas, refreshData }: any) => {
    const [vacunas, setVacunas] = useState<IVacunas[]>([]);
    const [estatusList, setEstatusList] = useState<IEstatus[]>([]);
    const [selectedVacuna, setSelectedVacuna] = useState<IVacunas | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const { userId } = useAuthStore();
    const [mascotas, setMascotas] = useState<IMascotas[]>([]);
    const { mascotaId } = useAuthStore();
    const [loading, setLoading] = useState(true);

    const hideModal = () => setVisible(false);

    const fetchData = async () => {
        if (!mascotaId) {
            console.warn("mascotaId no está disponible. No se realizará la llamada a la API.");
            return;
        }
        
        try {
            const response = await fetchVacunasById(mascotaId);
            setVacunas(response);
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al obtener las vacunas.");
        }
    };

    
    useEffect(() => {
        const fetchEstatus = async () => {
            try {
                const estatus = await getEstatus();
                setEstatusList(estatus);
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        };
    
        if (mascotaId) {
            fetchData();
            fetchEstatus();
        }
    }, [mascotaId, refreshData]);

    const closeModal = () => {
        setShowAllVacunas(false);
    };

    const getEstatusNombre = (idStatus: string) => {
        const estatus = estatusList.find((status) => status.id === idStatus);
        return estatus ? estatus.estatus : "Desconocido";
    };

const obtenerTimestamp = (fecha: any, hora: any) => {
    const horaConvertida = (hora ? hora : "12:00 AM").replace(' p. m.', 'PM').replace(' a. m.', 'AM');
    return new Date(`${fecha} ${horaConvertida}`).getTime();
};


const ultimasVacunas = [...vacunas]
    .sort((a, b) => {
        const timestampA = obtenerTimestamp(a.fechaAplicacion, a.horaAplicacion);
        const timestampB = obtenerTimestamp(b.fechaAplicacion, b.horaAplicacion);

        if (timestampB !== timestampA) {
            return timestampB - timestampA;
        }

        return b.id!.localeCompare(a.id!);
    })
    .slice(0, 3);

console.log("Últimas tres vacunas ordenadas:", ultimasVacunas);




    const handleEdit = async(item: IVacunas) => {
        setSelectedVacuna(item);
        setVisible(true);   
    };


    const handleDelete = (item: IVacunas) => {
        Alert.alert(
            "Confirmar",
            `¿Estás seguro de que deseas eliminar la vacuna ${item.nombreVacuna}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteVacuna(item.id!);
                            Alert.alert("Éxito", "La vacuna ha sido eliminada.");
                            fetchData();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar la vacuna.");
                        }
                    },
                },
            ]
        );
    };

    const EditButton = ({ onPress }: any) => (
        <View style={styles.editAction}>
            <TouchableOpacity style={styles.editButton} onPress={onPress}>
                <FontAwesome5 name="edit" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );

    const DeleteButton = ({ onPress }: any) => (
        <View style={styles.deleteAction}>
            <TouchableOpacity style={styles.deleteButton} onPress={onPress}>
                <FontAwesome5 name="trash" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );

    if(vacunas.length === 0){
        return(
            <View className="justify-center items-center">
                <Text className="text-gris font-medium">No se encontraron vacunas 🐈‍⬛</Text>
            </View>
        )
    }

    const renderSwipeableCard = ({ item }: any) => (
        <GestureHandlerRootView style={styles.swipeableContainer}>
                <Swipeable
                    renderRightActions={() => <DeleteButton onPress={() => handleDelete(item)} />}
                    renderLeftActions={() => <EditButton onPress={() => handleEdit(item)} />}
                >
                    <Card style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.title}>{item.nombreVacuna}</Text>
                            <Button 
                                mode="contained" 
                                style={
                                    getEstatusNombre(item.idStatus) === 'Pendiente' ? styles.statusButtonPendiente
                                    : getEstatusNombre(item.idStatus) === 'Completada' ? styles.statusButtonCompletada
                                    : getEstatusNombre(item.idStatus) === 'En proceso' ? styles.statusButtonProceso
                                    : styles.statusButtonDefault
                                }
                                labelStyle={
                                    getEstatusNombre(item.idStatus) === 'Pendiente' ? styles.statusLabelPendiente
                                    : getEstatusNombre(item.idStatus) === 'Completada' ? styles.statusLabelCompletada
                                    : getEstatusNombre(item.idStatus) === 'En proceso' ? styles.statusLabelProceso
                                    : styles.statusLabelDefault
                                }                            
                                >
                                {getEstatusNombre(item.idStatus)}
                            </Button>
                        </View>
                        <View style={styles.rowStart}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color="#757575" />
                            <Text style={styles.subtitle}>Hora de la aplicación: {item.horaAplicacion}</Text>
                        </View>
                        <View style={styles.rowStart}>
                            <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
                            <Text style={styles.subtitle}>Fecha de vacuna: {item.fechaAplicacion ? item.fechaAplicacion.split("T")[0] : "Fecha no disponible"}</Text>
                        </View>
                    </Card>
                </Swipeable>
        </GestureHandlerRootView>
    );

    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ width: '100%' }}>
                {ultimasVacunas.map((item) => (
                    <View key={item.id}>
                        {renderSwipeableCard({ item })}
                    </View>
                ))}
            </ScrollView>

            <Portal>
                <Modal visible={showAllVacunas} onDismiss={closeModal} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Todas las Vacunas</Text>
                    <FlatList
                        data={vacunas}
                        keyExtractor={(item) => item.id!.toString()}
                        renderItem={renderSwipeableCard}
                        contentContainerStyle={{ flexGrow: 1,}}
                    />
                    <Button onPress={closeModal}>Cerrar</Button>
                </Modal>
                <VacunaModal visible={visible} onDismiss={hideModal} onRefresh={refreshData} vacunaSeleccionada={selectedVacuna}/> 
            </Portal>
        </>
    );

};

const styles = StyleSheet.create({
    swipeableContainer: {
        borderRadius: 15,
        overflow: "hidden",
        marginBottom: 16,
        elevation: 5,
        width: '100%'
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 10,
        height: '70%',
        width: '90%', 
        alignSelf: 'center',
        justifyContent: 'center',
    },
    card: {
        padding: 15,
        backgroundColor: "#fff",
        elevation: 5,
        width: '100%',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 5
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        maxWidth: "80%",
        flexShrink: 1,
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
    fullScreenModalContainer: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 0,
        justifyContent: 'center'
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
    editAction: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00635D",
        width: 80,
        height: "96%",
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    deleteAction: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F44336",
        width: 80,
        height: "96%",
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    editButton: {
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButton: {
        justifyContent: "center",
        alignItems: "center",
    },
    statusButtonPendiente: {
        backgroundColor: '#a2231d',
    },
    statusButtonCompletada: {
        backgroundColor: '#00635D',
    },
    statusButtonProceso: {
        backgroundColor: '#FFFF00',
    },
    statusButtonDefault: {
        backgroundColor: '#E0E0E0'
    },
    statusLabelPendiente: {
        color: '#fff',
        fontSize: 12,
    },
    statusLabelCompletada: {
        color: '#fff', 
        fontSize: 12,   
    },
    statusLabelProceso: {
        color: '#000',  
        fontSize: 12,  
    },
    statusLabelDefault: {
        color: '#757575',
    },

});
