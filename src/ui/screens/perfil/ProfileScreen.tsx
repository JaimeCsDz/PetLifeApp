import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView, View } from 'react-native';
import { Appbar, Card, Text, Button, Menu, Divider } from 'react-native-paper';
import { Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VacunasScreen } from './VacunasScreen';
import { TrofeosScreen } from './TrofeosScreen';
import { VacunaModal } from './VacunasModal'; 
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/useAuthStore';
import { RootStackParams } from '../../routes/StackNavigator';

export const ProfileScreen = () => {
    const [visible, setVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const navigation = useNavigation<NavigationProp<RootStackParams>>();


    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const logOut = useAuthStore((x)=> x.logout)

    const handleLogOut = () => {
        logOut()
        navigation.reset({
            index: 0,
            routes: [{name: 'InicioScreen'}]
        })
    }

    const handlePerfil = () => {
        
        closeMenu();
    };



    return (
        <SafeAreaView style={styles.safeArea}>
            <Appbar.Header>
                <Appbar.Content title="Perfil" style={styles.appbarContent} titleStyle={styles.titulo} />
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    contentStyle={styles.menuStyle}
                    anchor={
                        <Appbar.Action icon="dots-vertical" onPress={openMenu} color="#00635D" />
                    }
                >
                    <Menu.Item
                        onPress={handlePerfil}
                        title="Agregar mascota"
                        leadingIcon={() => <MaterialCommunityIcons name="paw" size={20} color="#fff" />}
                        titleStyle={styles.menuItemText}
                    />
                    <Divider style={styles.divider} />
                    <Menu.Item
                        onPress={handlePerfil}
                        title="Cambiar de perfil"
                        leadingIcon={() => <MaterialCommunityIcons name="account-switch" size={20} color="#fff" />}
                        titleStyle={styles.menuItemText}
                    />
                    <Divider style={styles.divider} />
                    <Menu.Item
                        onPress={handleLogOut}
                        title="Cerrar sesión"
                        leadingIcon={() => <MaterialCommunityIcons name="logout" size={20} color="#fff" />}
                        titleStyle={styles.menuItemText}
                    />
                </Menu>
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
                        Control de vacunas <MaterialCommunityIcons name="needle" size={17} color="#757575" />
                    </Text>
                    <Button style={styles.boton} mode="contained" labelStyle={styles.text} onPress={showModal}>
                        Agregar vacuna
                    </Button>
                </View>
                <View style={styles.vacunas}>
                    <VacunasScreen />
                </View>
                <View style={styles.trofeos}>
                    <TrofeosScreen />
                </View>
            </ScrollView>

            <VacunaModal visible={visible} onDismiss={hideModal} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff", 
    },
    appbarContent: {
        alignItems: "center", 
        justifyContent: 'center',
    },
    titulo: {
        fontWeight: "bold",
        fontFamily: "Urbanist-Semibold", 
        fontSize: 22,
        marginRight: -30,
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
    trofeos:{
        width: '90%'
    },
    menuStyle: {
        backgroundColor: '#333',
        borderRadius: 10,
        paddingVertical: 5,
        marginTop: 75
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
    },
    divider: {
        backgroundColor: '#555',
        height: 1,
    },


});
