import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, View } from "react-native";
import { Appbar, Card, Text, Button, Portal, Modal } from "react-native-paper";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VacunasScreen } from "./VacunasScreen";
import { TrofeosScreen } from "./TrofeosScreen";

export const ProfileScreen = () => {
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
        <>
        <SafeAreaView style={styles.safeArea}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {}} color="#00635D"/>
                <Appbar.Content
                title="Perfil"
                style={styles.appbarContent}
                titleStyle={styles.titulo}
                />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <Image source={require('../../../assets/Profile.jpg')} style={styles.image} />
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.title}>Pastor Aleman dog</Text>
                        <View style={styles.row}>
                            <MaterialCommunityIcons name="paw" size={20} color="#757575" />
                            <Text style={styles.subtitle}>Fibby</Text>
                        </View>
                        <View style={styles.row}>
                            <MaterialCommunityIcons name="map-marker" size={20} color="#757575" />
                            <Text style={styles.subtitle}>Cancún, Quintana Roo</Text>
                        </View>
                        <View style={styles.row}>
                            <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
                            <Text style={styles.subtitle}>17/02/2010</Text>
                        </View>
                        <View style={styles.row}>
                            <MaterialCommunityIcons name="information" size={20} color="#757575" />
                            <Text style={styles.subtitle}>20 Kg, 60CM</Text>
                        </View>
                    </Card.Content>
                </Card>
                <View style={styles.contenedor}>
                    <Text style={styles.vacunasText}>
                        Control de vacunas <MaterialCommunityIcons name="needle" size={17} color="#757575"/>
                    </Text>
                    <Button style={styles.boton} mode="contained" labelStyle={styles.text} onPress={showModal}>Agregar vacuna</Button>
                </View>
                <View style={styles.vacunas}>
                    <VacunasScreen />
                </View>
                <View style={styles.trofeos}>
                    <TrofeosScreen />
                </View>
            </ScrollView>

            {/* Modal para agregar vacuna */}
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Agregar vacuna</Text>
                    <View style={styles.botones}>
                        <Button onPress={hideModal} style={styles.closeButton} textColor="#ffffff">Cerrar</Button>
                        <Button onPress={hideModal} style={styles.closeButton} textColor="#ffffff">Guardar</Button>
                    </View>
                </Modal>
            </Portal>
        </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff", 
    },
    appbarContent: {
        alignItems: "center", 
        marginRight: 55
    },
    titulo: {
        fontWeight: "bold",
        fontFamily: "Urbanist-Semibold", 
        fontSize: 22,
        color: "#00635D",
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    card: {
        marginTop: 20,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        elevation: 5,
        width: '95%'
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: "#656464",
        marginLeft: 5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    contenedor:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginTop: 10,
    },
    vacunasText: {
        fontSize: 15,
        color: "#656464",
        fontWeight: 'semibold'
    },
    boton:{
        backgroundColor: '#00635D',
        width: 122,
        borderRadius: 15,
        height: 40
    },
    text:{
        fontSize: 10,
    },
    vacunas:{   
        width: '90%',
        top: 10,
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#00635D",
        color: '#fff',
        width: 90,
        margin: 10
    },
    botones:{
        flexDirection: 'row',
        justifyContent: 'center',
    },
    trofeos:{
        width: '90%'
    }
});
