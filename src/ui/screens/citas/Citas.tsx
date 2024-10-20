import React, { useState } from "react";
import { SafeAreaView, View, FlatList, StyleSheet, Image, NativeSyntheticEvent, NativeScrollEvent, Platform, StatusBar } from "react-native";
import { Button, Text, Card, Avatar } from 'react-native-paper';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedFAB } from 'react-native-paper';
import { RootStackParams } from "../../routes/StackNavigator";

export const Citas = ({ visible }: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const [isExtended, setIsExtended] = useState(true);

    // Simulación de citas
    const [citas, setCitas] = useState([
        { id: '1', motivo: 'Chequeo general', mascota: 'Fibby', lugar: 'Cancún, Quintana Roo', fecha: '17/02/2010 - 02:20 PM', veterinaria: 'Veterinaria Santa Fe', estado: 'Pendiente', imagen: require("../../../assets/gato.png") },
        { id: '2', motivo: 'Vacunación', mascota: 'Max', lugar: 'Ciudad de México', fecha: '20/10/2023 - 10:00 AM', veterinaria: 'Veterinaria Central', estado: 'Completado', imagen: require("../../../assets/gato.png") },
        { id: '3', motivo: 'Vacunación', mascota: 'Max', lugar: 'Ciudad de México', fecha: '20/10/2023 - 10:00 AM', veterinaria: 'Veterinaria Central', estado: 'Completado', imagen: require("../../../assets/gato.png") },
        { id: '4', motivo: 'Vacunación', mascota: 'Max', lugar: 'Ciudad de México', fecha: '20/10/2023 - 10:00 AM', veterinaria: 'Veterinaria Central', estado: 'Completado', imagen: require("../../../assets/gato.png") },
        { id: '5', motivo: 'Vacunación', mascota: 'Max', lugar: 'Ciudad de México', fecha: '20/10/2023 - 10:00 AM', veterinaria: 'Veterinaria Central', estado: 'Completado', imagen: require("../../../assets/gato.png") },
        { id: '6', motivo: 'Vacunación', mascota: 'Max', lugar: 'Ciudad de México', fecha: '20/10/2023 - 10:00 AM', veterinaria: 'Veterinaria Central', estado: 'Completado', imagen: require("../../../assets/gato.png") },
        { id: '7', motivo: 'Vacunación', mascota: 'Max', lugar: 'Ciudad de México', fecha: '20/10/2023 - 10:00 AM', veterinaria: 'Veterinaria Central', estado: 'Completado', imagen: require("../../../assets/gato.png") },
        { id: '8', motivo: 'Vacunación', mascota: 'Max', lugar: 'Ciudad de México', fecha: '20/10/2023 - 10:00 AM', veterinaria: 'Veterinaria Central', estado: 'Completado', imagen: require("../../../assets/gato.png") },
    ]);

    // Renderizar citas
    const renderCita = ({ item }: any) => (
        <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Card style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.cardLeft}>
                        <Text style={styles.motivoText}>{item.motivo}</Text>
                        <View style={styles.detailRow}>
                            <Icon name="paw" size={16} color="#656464" />
                            <Text style={styles.detailText}>{item.mascota}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Icon name="map-marker" size={16} color="#656464" />
                            <Text style={styles.detailText}>{item.lugar}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Icon name="calendar" size={16} color="#656464" />
                            <Text style={styles.detailText}>{item.fecha}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Icon name="hospital-building" size={16} color="#656464" />
                            <Text style={styles.detailText}>{item.veterinaria}</Text>
                        </View>
                    </View>
                    <View style={styles.cardRight}>
                        <Text style={[styles.estado, item.estado === 'Pendiente' ? styles.estadoPendiente : styles.estadoCompletado]}>{item.estado}</Text>
                        <Avatar.Image size={60} source={item.imagen} style={styles.avatar} />
                    </View>
                </View>
                <Card.Actions style={styles.cardActions}>
                    <Button mode="text" onPress={() => { }}>Detalles</Button>
                </Card.Actions>
            </Card>
        </SafeAreaView>
    );

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const isScrollingDown = currentOffset > 10;
        setIsExtended(!isScrollingDown);
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1,  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, }}>
                {citas.length === 0 ? (
                    <View style={styles.container}>
                        <Image
                            source={require("../../../assets/dog-gum.png")}
                            style={styles.image}
                        />
                        <Text style={styles.text}>Parece que no tienes citas disponibles</Text>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={() => navigation.navigate("FormCitasScreen")}
                        >
                            Agregar cita
                        </Button>
                    </View>
                ) : (
                    <FlatList
                        data={citas}
                        renderItem={renderCita}
                        keyExtractor={(item: any) => item.id}
                        ListHeaderComponent={<Text style={styles.header}>Historial de citas médicas</Text>}
                        onScroll={handleScroll} 
                        scrollEventThrottle={16}
                    />
                )}
            </SafeAreaView>
            <AnimatedFAB
                icon={'plus'}
                label={'Agregar cita'}
                color="#fff"
                extended={isExtended}
                onPress={() => navigation.navigate("FormCitasScreen")}
                visible={visible}
                animateFrom={'right'}
                iconMode={'dynamic'}
                
                style={styles.fabStyle}
            />
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 2,
        height: 170,
        width: '90%'
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
    cardLeft: {
        flex: 3,
        paddingRight: 10,
    },
    cardRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    motivoText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#00635D',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    detailText: {
        fontSize: 14,
        color: '#656464',
        marginLeft: 5,
    },
    estado: {
        padding: 5,
        borderRadius: 10,
        fontSize: 12,
        textAlign: 'center',
        marginTop: -20
    },
    estadoPendiente: {
        backgroundColor: '#FFFF00',
        color: '#000',
    },
    estadoCompletado: {
        backgroundColor: '#00C853',
        color: '#fff',
    },
    avatar: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 0
    },
    cardActions: {
        justifyContent: 'flex-end',
        marginTop: -30
    },
    image: {
        height: 120,
        width: 120,
        marginBottom: 0
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'semibold',
        fontSize: 14,
        color: '#656464',
    },
    button: {
        textAlign: 'center',
        borderRadius: 12,
        backgroundColor: '#00635D',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    fabStyle: {
        backgroundColor: '#037972',
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});
