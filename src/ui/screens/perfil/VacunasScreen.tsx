import { SafeAreaView, View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const vacunasData = [
    { nombre: "Rabia", hora: "2:34 PM", fecha: "18-10-2024", status: "Aplicada" },
    { nombre: "Parvovirus", hora: "1:00 PM", fecha: "10-09-2024", status: "Aplicada" },
    { nombre: "Distemper", hora: "3:45 PM", fecha: "05-12-2024", status: "Pendiente" },
    { nombre: "Leptospirosis", hora: "11:20 AM", fecha: "30-11-2024", status: "Aplicada" },
];

export const VacunasScreen = () => {
    return (
        <SafeAreaView>
            {vacunasData.map((vacuna, index) => (
                <Card key={index} style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.title}>{vacuna.nombre}</Text>
                        <Button 
                            mode="contained" 
                            style={vacuna.status === "Aplicada" ? styles.statusButtonApplied : styles.statusButtonPending} 
                            labelStyle={vacuna.status === "Aplicada" ? styles.statusButtonLabelApplied : styles.statusButtonLabelPending}
                        >
                            {vacuna.status}
                        </Button>
                    </View>
                    <View style={styles.rowStart}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color="#757575" />
                        <Text style={styles.subtitle}>Hora de la aplicación: {vacuna.hora}</Text>
                    </View>
                    <View style={styles.rowStart}>
                        <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
                        <Text style={styles.subtitle}>Fecha de vacuna: {vacuna.fecha}</Text>
                    </View>
                </Card>
            ))}
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
});
