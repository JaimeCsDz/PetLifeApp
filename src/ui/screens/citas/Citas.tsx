import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, StyleSheet, Image, NativeSyntheticEvent, NativeScrollEvent, Platform, StatusBar, Alert } from "react-native";
import { Button, Text, Card, Avatar } from 'react-native-paper';
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedFAB } from 'react-native-paper';
import { RootStackParams } from "../../routes/StackNavigator";
import { ICitas } from "../../../interfaces/citas/ICitas";
import { GetCitasById } from "../../../actions/citas/citas";
import { useAuthStore } from "../../../store/useAuthStore";

export const Citas = ({ visible }: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const [isExtended, setIsExtended] = useState(true);
    const [citas, setCitas] = useState<ICitas[]>([])
    const { mascotaId } = useAuthStore()
    console.log(mascotaId)

    useEffect(() => {
        const fetchdata = async (id: string) => {
            try {
                if (mascotaId) {
                    console.log("Fetching citas for mascotaId:", mascotaId);
                    const response = await GetCitasById(mascotaId);
                    console.log("Fetched citas:", response);
        
                    if (response && response.data) {
                        setCitas(response.data);
                    } else {
                        setCitas([]);
                    }
                } else {
                    console.log('No existe una mascota');
                }
            } catch (error) {
                console.error("Error al cargar las citas:", error);
                Alert.alert("Error", "Ocurrió un error al cargar las citas");
            }
        };
            
        if (mascotaId) {
            fetchdata(mascotaId);
        }
    }, [mascotaId]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    if (mascotaId) {
                        const response = await GetCitasById(mascotaId);
                        if (response && response.data) {
                            setCitas(response.data);
                        } else {
                            setCitas([]);
                        }
                    }
                } catch (error) {
                    console.error("Error al cargar las citas:", error);
                    Alert.alert("Error", "Ocurrió un error al cargar las citas");
                }
            };

            fetchData();
        }, [mascotaId]) // Esto se ejecutará cada vez que la pantalla esté enfocada
    );
    
    // Renderizar citas
    const renderCita = ({ item }: any) => (
        <SafeAreaView className="justify-center items-center flex-1 bg-white">
            <Card style={styles.card} className="m-2.5 p-2.5 rounded-2xl h-44 w-[90%]">
                <View  className="flex-row justify-between items-center p-2">
                    <View style={styles.cardLeft}>
                        <Text style={styles.motivoText} numberOfLines={1} ellipsizeMode="tail">{item.motivoCita}</Text>
                        <View style={styles.detailRow}>
                            <Icon name="paw" size={16} color="#656464" />
                            <Text style={styles.detailText} >{item.nombreMascota}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Icon name="map-marker" size={16} color="#656464" />
                            <Text style={styles.detailText}>{item.hora}</Text>
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
                        <Text style={[styles.estado, item.estatu === 'Pendiente' ? styles.estadoPendiente : styles.estadoCompletado]}>{item.estatu}</Text>
                        <Avatar.Image size={60} source={item.fotoMascota} style={styles.avatar} />
                    </View>
                </View>
                <Card.Actions style={styles.cardActions}>
                    <Button mode="text" onPress={() => navigation.navigate("DetailsCitasScreen", { cita: item })}>Detalles</Button>
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
                    <>
                    <FlatList
                        data={citas}
                        renderItem={renderCita}
                        keyExtractor={(item: any) => item.id}
                        ListHeaderComponent={
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerTitle}>Agregar Cita</Text>
                                <Text style={styles.headerSubtitle}>Historial de citas médicas</Text>
                            </View>
                        }
                        onScroll={handleScroll} 
                        scrollEventThrottle={16}
                    />
                    <AnimatedFAB
                        icon={'plus'}
                        label={'Agregar cita'}
                        color="#fff"
                        extended={isExtended}
                        onPress={() => navigation.navigate("FormCitasScreen")}
                        visible={visible}
                        animateFrom={'right'}
                        iconMode={'dynamic'}
                        pointerEvents={isExtended ? 'auto' : 'box-none'}
                        style={styles.fabStyle}
                    />
                    </>
                )}
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        elevation: 2,
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
        marginTop: -30,
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
        backgroundColor: '#fff'
    },
    text: {
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
    headerContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#FFF', 
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00635D',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#656464',
        marginTop: 5,
    },
});
