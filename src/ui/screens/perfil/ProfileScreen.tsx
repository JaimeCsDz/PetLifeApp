import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import { Appbar, Card, Button, Menu, Divider, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/useAuthStore';
import { RootStackParams } from '../../routes/StackNavigator';
import { getMascotasByUserId, getRaza } from '../../../actions/profile/profile';
import { IMascotas } from '../../../interfaces/Mascota/IMascota';
import { VacunaModal } from './VacunasModal';
import { VacunasScreen } from './VacunasScreen';
import { TrofeosScreen } from './TrofeosScreen';
import { ActivityIndicator } from 'react-native';

export const ProfileScreen = () => {
    const [visible, setVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [expandirSubmenu, setExpandirSubmenu] = useState(false);
    const [mascotas, setMascotas] = useState<IMascotas[]>([]);
    const [mascotaActiva, setMascotaActiva] = useState<IMascotas | null>(null);
    const [loading, setLoading] = useState(true);
    const [razas, setRazas] = useState<{ [key: string]: string }>({});
    const { userId } = useAuthStore();
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const logOut = useAuthStore((x) => x.logout);

    const handleLogOut = () => {
        logOut();
        navigation.reset({
            index: 0,
            routes: [{ name: 'InicioScreen' }],
        });
    };

    const AddProfile = () => {
        navigation.navigate('FormMascota');
        closeMenu();
    };

    const handleSelectMascota = (mascota: IMascotas) => {
        setMascotaActiva(mascota);
        closeMenu();
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            setLoading(true);

            const result = await getMascotasByUserId(userId);
            setMascotas(Array.isArray(result.data) ? result.data : []);

            const razasResult = await getRaza();
            const razasMap = razasResult.reduce((acc, raza) => {
                acc[raza.id] = raza.razaMascota;
                return acc;
            }, {} as { [key: string]: string });
            setRazas(razasMap);

            if (result.data && result.data.length > 0) {
                setMascotaActiva(result.data[0]);
            }

            setLoading(false);
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return  (
            <View className='flex-1 justify-center items-center bg-white'>
                <ActivityIndicator animating={true} color={'#00635D'} size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Appbar.Header>
                <Appbar.Content title="Perfil" style={styles.appbarContent} titleStyle={styles.titulo} />
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    contentStyle={styles.menuStyle}
                    anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} color="#00635D" />}
                >
                    <Menu.Item
                        onPress={AddProfile}
                        title="Agregar mascota"
                        leadingIcon={() => <MaterialCommunityIcons name="paw" size={20} color="#fff" />}
                        titleStyle={styles.menuItemText}
                    />
                    <Divider style={styles.divider} />

                    {/* Menú desplegable para "Cambiar perfil" */}
                    <List.Accordion
                        title="Cambiar perfil"
                        expanded={expandirSubmenu}
                        onPress={() => setExpandirSubmenu(!expandirSubmenu)}
                        left={() => <MaterialCommunityIcons name="dog" size={22} color="#fff" style={{marginLeft: 10, marginTop:5}} />}
                        titleStyle={styles.menuItemText}
                        style={[styles.accordion,{paddingVertical: 5}]}
                    >
                        {mascotas.map((mascota) => (
                            <List.Item
                                key={mascota.id}
                                title={mascota.nombreMascota}
                                onPress={() => handleSelectMascota(mascota)}
                                left={() => <MaterialCommunityIcons name="paw" size={20} color="#fff" style={{marginLeft:10}}/>}
                                titleStyle={styles.menuItemText}
                            />
                        ))}
                    </List.Accordion>

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
                {mascotaActiva ? (
                    <React.Fragment>
                        <Image source={{ uri: mascotaActiva.fotoMascota }} style={styles.image} />
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.title}>{razas[mascotaActiva.idRazaMascota] || 'Sin raza'}</Text>
                                <View style={styles.row}>
                                    <MaterialCommunityIcons name="paw" size={20} color="#757575" />
                                    <Text style={styles.subtitle}>{mascotaActiva.nombreMascota}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
                                    <Text style={styles.subtitle}>{mascotaActiva.fechaNacimiento}</Text>
                                </View>
                                <View style={styles.row}>
                                    <MaterialCommunityIcons name="information" size={20} color="#757575" />
                                    <Text style={styles.subtitle}>{mascotaActiva.peso} Kg, {mascotaActiva.altura} CM</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </React.Fragment>
                ) : (
                    <Text style={styles.noMascotasText}>Selecciona una mascota para ver su perfil.</Text>
                )}
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
        fontSize: 22,
        color: "#00635D",
        marginRight: -30
    },
    content: {
        justifyContent:'center',
        alignItems: 'center'
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 20,
    },
    noMascotasText: {
        fontSize: 18,
        color: "#757575",
        textAlign: 'center',
        marginTop: 20,
    },
    vacunas:{   
        width: '90%',
        top: 10,
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
    trofeos:{
        width: '90%'
    },
    card: {
        marginTop: 20,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        elevation: 5,
        width: '90%',
    },
    title: {
        fontSize: 20,
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
    menuStyle: {
        backgroundColor: '#333',
        borderRadius: 10,
        paddingVertical: 5,
        marginTop: 75,
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
    },
    divider: {
        backgroundColor: '#555',
        height: 1,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    accordion: {
        backgroundColor: '#333',
    },
});
