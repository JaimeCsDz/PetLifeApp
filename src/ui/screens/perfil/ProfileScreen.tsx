import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Card, Button, Menu, Divider, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/useAuthStore';
import { RootStackParams } from '../../routes/StackNavigator';
import { getMascotasByUserId, getRaza } from '../../../actions/profile/profile';
import { IMascotas } from '../../../interfaces/Mascota/IMascota';
import { VacunaModal } from './VacunasModal';
import { VacunasScreen } from './VacunasScreen';
import { ActivityIndicator } from 'react-native';
import { IRaza } from '../../../interfaces/Mascota/IRaza';
import { IVacunas } from '../../../interfaces/vacunas/IVacunas';
import { fetchVacunasById } from '../../../actions/vacunas/vacunas';


export const ProfileScreen = () => {
    const [visible, setVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [vacunaMenuVisible, setVacunaMenuVisible] = useState(false);
    const [expandirSubmenu, setExpandirSubmenu] = useState(false);
    const [mascotas, setMascotas] = useState<IMascotas[]>([]);
    const [showAllVacunas, setShowAllVacunas] = useState(false);
    const [mascotaActiva, setMascotaActiva] = useState<IMascotas | null>(null);
    const [loading, setLoading] = useState(true);
    const [razas, setRazas] = useState<Record<string, string>>({});
    const { userId, setMascotaId } = useAuthStore();
    const [vacunas, setVacunas] = useState<IVacunas[]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const showModal = () => {
        setVisible(true);
        closeVacunaMenu();
    };
    
    const hideModal = () => setVisible(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const openVacunaMenu = () => setVacunaMenuVisible(true);
    const closeVacunaMenu = () => setVacunaMenuVisible(false);
    const logOut = useAuthStore((x) => x.logout);

    const verVacunas = () => {
        setShowAllVacunas(true);         
        closeVacunaMenu();
    };


useFocusEffect(
    React.useCallback(() => {
        refreshData();
    }, [userId, mascotaActiva])
);


    const handleLogOut = () => {
        setMascotas([]);
        setVacunas([]);
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
        if (mascota.id) {
            setMascotaActiva(mascota);
            setMascotaId(mascota.id); 
            closeMenu();
            console.log(mascota.id);
        } else {
            console.error("El ID de la mascota es undefined.");
        }
    };

    const refreshData = async () => {
        if (!userId) return;
        setLoading(true);

        const result = await getMascotasByUserId(userId);
        setMascotas(Array.isArray(result.data) ? result.data : []);

        if (mascotaActiva?.id) {
            const vacunasResponse = await fetchVacunasById(mascotaActiva.id);
            setVacunas(vacunasResponse);
        }

        setLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, [userId, mascotaActiva]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            setLoading(true);
    
            try {
                const result = await getMascotasByUserId(userId);
                const mascotasObtenidas = Array.isArray(result.data) ? result.data : [];
                setMascotas(mascotasObtenidas);
    
                if (mascotasObtenidas.length > 0) {
                    const primeraMascota = mascotasObtenidas[0];
                    setMascotaActiva(primeraMascota);
                    if (primeraMascota.id) setMascotaId(primeraMascota.id);
                } else {
                    setMascotaActiva(null);
                }
    
                const razasResult: IRaza[] = await getRaza();
                const razasMap = razasResult.reduce((acc: Record<string, string>, raza: IRaza) => {
                    acc[raza.id] = raza.razaMascota;
                    return acc;
                }, {} as Record<string, string>);
                setRazas(razasMap);
                console.log("Razas cargadas:", razasMap); 
            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [userId]);

    

    if (loading) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator animating={true} color={'#00635D'} size="large" />
            </View>
        );
    }

    if(mascotas.length === 0){
        return(
            <>
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
                    <List.Accordion
                        title="Cambiar perfil"
                        expanded={expandirSubmenu}
                        onPress={() => setExpandirSubmenu(!expandirSubmenu)}
                        left={() => <MaterialCommunityIcons name="dog" size={22} color="#fff" style={{ marginLeft: 10, marginTop: 5 }} />}
                        titleStyle={styles.menuItemText}
                        style={[styles.accordion, { paddingVertical: 5 }]}
                    >
                        {mascotas.map((mascota) => (
                            <List.Item
                                key={mascota.id}
                                title={mascota.nombreMascota}
                                onPress={() => handleSelectMascota(mascota)}
                                left={() => <MaterialCommunityIcons name="paw" size={20} color="#fff" style={{ marginLeft: 10 }} />}
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
            <View style={styles.container}>
                    <Image source={require("../../../assets/dog-gum.png")} style={styles.imagen} />
                    <Text style={styles.tex}>Parece que no tienes mascotas registradas 🐶</Text>
                    <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("FormMascota")}>
                        Agregar mascota
                    </Button>
            </View>
            </>
        )
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
                    <List.Accordion
                        title="Cambiar perfil"
                        expanded={expandirSubmenu}
                        onPress={() => setExpandirSubmenu(!expandirSubmenu)}
                        left={() => <MaterialCommunityIcons name="dog" size={22} color="#fff" style={{ marginLeft: 10, marginTop: 5 }} />}
                        titleStyle={styles.menuItemText}
                        style={[styles.accordion, { paddingVertical: 5 }]}
                    >
                        {mascotas.map((mascota) => (
                            <List.Item
                                key={mascota.id}
                                title={mascota.nombreMascota}
                                onPress={() => handleSelectMascota(mascota)}
                                left={() => <MaterialCommunityIcons name="paw" size={20} color="#fff" style={{ marginLeft: 10 }} />}
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

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {mascotaActiva ? (
                    <>
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
                    </>
                ) : (
                    <Text style={styles.noMascotasText}>Selecciona una mascota para ver su perfil.</Text>
                )}

                <View style={styles.contenedor}>
                    <Text style={styles.vacunasText}>
                        Control de vacunas <MaterialCommunityIcons name="needle" size={17} color="#757575" />
                    </Text>
                    <Menu
                        visible={vacunaMenuVisible}
                        onDismiss={closeVacunaMenu}
                        anchor={
                            <Button style={styles.boton} mode="contained" labelStyle={styles.text} onPress={openVacunaMenu}>
                                Opciones
                            </Button>
                        }
                    >
                        <Menu.Item onPress={showModal} title="Agregar vacuna" />
                        <Menu.Item onPress={verVacunas} title="Ver todas las vacunas" />
                    </Menu>
                </View>

                <View style={styles.vacunas}>
                    <VacunasScreen  
                        showAllVacunas={showAllVacunas}
                        setShowAllVacunas={setShowAllVacunas}
                        refreshData={refreshData}
                    />
                </View>
            </ScrollView>

            <VacunaModal visible={visible} onDismiss={hideModal} onRefresh={refreshData} /> 
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 120,
    },
    imagen: {
        height: 120,
        width: 120,
        marginBottom: 0
    },
    tex: {
        fontWeight: 'semibold',
        fontSize: 15,
        color: '#656464',
        marginBottom: 10,
        marginTop: 5
    },
    button: {
        textAlign: 'center',
        borderRadius: 12,
        backgroundColor: '#00635D',
    },
    appbarContent: {
        alignItems: "center",
        justifyContent: 'center',
    },
    titulo: {
        fontWeight: "bold",
        fontSize: 22,
        color: "#00635D",
        marginRight: -30,
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    noMascotasText: {
        fontSize: 18,
        color: "#757575",
        textAlign: 'center',
        marginTop: 20,
    },
    vacunas: {   
        width: '90%',
        marginTop: 10,
        marginBottom: 70
    },
    contenedor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginTop: 10,
    },
    vacunasText: {
        fontSize: 15,
        color: "#656464",
        fontWeight: 'semibold',
    },
    boton: {
        backgroundColor: '#00635D',
        width: 100,
        borderRadius: 20,
        height: 40,
        marginBottom: 20
    },
    text: {
        fontSize: 10,
    },
    card: {
        marginTop: 10,
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
        height: 250,
        resizeMode: 'cover',
    },
    accordion: {
        backgroundColor: '#333',
    },
});
