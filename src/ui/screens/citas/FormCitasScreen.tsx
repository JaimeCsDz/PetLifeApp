import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { Text, Button, Menu, Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { getEstatus, getMotivosByIdTipo, getTipoMascota, getVeterinarias, PostCitasMascotas } from "../../../actions/citas/citas";
import { IVeterinaria } from "../../../interfaces/citas/IVeterinaria";
import { ITipoMascota } from "../../../interfaces/Mascota/ITipoMascota";
import { useAuthStore } from "../../../store/useAuthStore";
import { getMascotasByUserId } from "../../../actions/profile/profile";
import { IMascotas } from "../../../interfaces/Mascota/IMascota";
import { IEstatus } from "../../../interfaces/vacunas/IEstatus";
import { IMotivoCitas } from "../../../interfaces/citas/IMotivoCitas";
import { ICitas } from "../../../interfaces/citas/ICitas";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../routes/StackNavigator";


export const FormCitasScreen = () => {
    const [veterinario, setVeterinario] = useState('');
    const [veterinarioId, setVeterinarioId] = useState('');
    const [visibleVeterinario, setVisibleVeterinario] = useState(false);
    
    const [motivo, setMotivo] = useState('');
    const [motivoId, setMotivoId] = useState(''); 
    const [visibleMotivo, setVisibleMotivo] = useState(false);
    const [motivosList, setMotivosList] = useState<IMotivoCitas[]>([]);

    const [veterinarias, setVeterinarias] = useState<IVeterinaria[]>([]);

    const [especie, setEspecie] = useState<ITipoMascota[]>([]);
    const [selectedEspecie, setSelectedEspecie] = useState<string>('');
    const [selectedEspecieId, setSelectedEspecieId] = useState('');
    const [visibleEspecie, setVisibleEspecie] = useState(false);

    const [mascotas, setMascotas] = useState<IMascotas[]>([]);
    const [mascota, setMascota] = useState('')
    const [mascotaId, setMascotaId] = useState('');
    const [visibleMascota, setVisibleMascota ] = useState(false)

    const [estatusList, setEstatusList] = useState<IEstatus[]>([]);
    const [visibleStatus, setVisibleStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedStatusId, setSelectedStatusId] = useState<string>('');
    
    const [selectedDate, setSelectedDate] = useState('');
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    const { userId } = useAuthStore()


    useEffect(() => {
        const fetchVeterinarias = async () => {
            try {
                const data = await getVeterinarias();
                setVeterinarias(data);
            } catch (error) {
                console.error("Error al cargar las veterinarias:", error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await getTipoMascota();
                if (response.length > 0) {
                    setEspecie(response);
                } else {
                    Alert.alert("Error", "No se encontraron tipos de mascotas");
                }
            } catch (error) {
                Alert.alert('Error', 'Ocurrió un error al cargar los datos');
            }
        };

        const fetchMascotas = async () => {
            try {
                if (userId) {
                    const mascotasData = await getMascotasByUserId(userId);
                    setMascotas(mascotasData.data || []);
                }
            } catch (error) {
                Alert.alert("Error", "No se pudo obtener las mascotas del usuario.");
                console.error("Error al obtener las mascotas:", error);
            }
        };
        const fetchEstatus = async () => {
            try {
                const estatusData = await getEstatus();
                setEstatusList(estatusData);
            } catch (error) {
                Alert.alert("Error", "No se pudo obtener los estados.");
                console.error("Error al obtener los estados:", error);
            }
        };
        
        fetchEstatus()
        fetchMascotas()
        fetchData()
        fetchVeterinarias();
    }, []);

    useEffect(() => {
        const fetchMotivos = async () => {
            if (selectedEspecieId) {
                try {
                    const data = await getMotivosByIdTipo(selectedEspecieId);
                    setMotivosList(data);
                } catch (error) {
                    Alert.alert("Error", "No se pudo obtener los motivos de citas.");
                    console.error("Error al obtener los motivos de citas:", error);
                }
            }
        };

        fetchMotivos();
    }, [selectedEspecieId]);

    const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
    
    const handleGuardarCita = async () => {
        if(!veterinario || !motivo || !selectedDate || !selectedStatus){
            Alert.alert("Error", "Por favor completa todos los campos")
            return
        }

        const citasData: ICitas = {
            idMotivoCita: motivoId,
            fecha: new Date(selectedDate).toISOString(),
            hora: formattedTime,
            idStatus: selectedStatusId,
            idMascota: mascotaId,
            idUser: userId ?? '',
            idVeterinaria: veterinarioId,
            notaAdicional: ''
        }
        console.log('Datos a enviar citas', citasData)

        try {
            const response = await PostCitasMascotas(citasData)
            if(response.isSuccess){
                Alert.alert("Exito", "Cita creada")
                navigation.navigate('HomeScreen')
            }else{
                Alert.alert('Error', response.message || 'No se pudo registrar la cita')
            }
        } catch (error) {
            console.log('error al registrar la cita', error)
        }
    }



    const onChangeTime = (event:any, selectedTime:any) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <ScrollView>
                <View style={styles.container}>
                <Appbar.Header style={styles.appBar}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color="#00635D" size={25}/>
                        <Text style={styles.title}>Agregar Cita</Text>
                </Appbar.Header>
                <Text style={styles.subtitle}>Registra las citas de tu mascota</Text>
                    <View style={styles.contenedor}>
                    {/* Tipo de mascota */}
                    <Text style={styles.label}>Especie</Text>
                        <Menu
                            visible={visibleEspecie}
                            onDismiss={() => setVisibleEspecie(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    onPress={() => setVisibleEspecie(true)}
                                    contentStyle={styles.dropdownButton}
                                    icon={() => <Icon name="arrow-drop-down" size={20} color="#656464" />}
                                    labelStyle={styles.placeholderText}
                                    style={styles.Button}
                                >
                                    {selectedEspecie ? selectedEspecie : 'Selecciona la especie'}
                                </Button>
                            }
                        >
                            {especie.map((item) => (
                                <Menu.Item
                                    key={item.id}
                                    onPress={() => {
                                        setSelectedEspecie(item.tipo);
                                        setSelectedEspecieId(item.id)
                                        setVisibleEspecie(false);
                                    }}
                                    title={item.tipo}
                                />
                            ))}
                        </Menu>
                    {/* mascota */}
                    <Text style={styles.label}>Mascota</Text>
                    <Menu
                        visible={visibleMascota}
                        onDismiss={() => setVisibleMascota(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setVisibleMascota(true)}
                                contentStyle={styles.dropdownButton}
                                icon={() => <Icon name="arrow-drop-down" size={20} color="#656464" />}
                                labelStyle={styles.placeholderText}
                                style={styles.Button}
                            >
                                {mascota ? mascota : 'Selecciona a tu mascota'}
                            </Button>
                        }
                    >
                        {mascotas.map((item) => (
                            <Menu.Item
                                key={item.id}
                                onPress={() => {
                                    setMascota(item.nombreMascota)
                                    setMascotaId(item.id!)
                                    setVisibleMascota(false);
                                }}
                                title={item.nombreMascota}
                            />
                        ))}
                    </Menu>
                    {/* Motivo */}
                    <Text style={styles.label}>Motivo</Text>
                    <Menu
                        visible={visibleMotivo}
                        onDismiss={() => setVisibleMotivo(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setVisibleMotivo(true)}
                                contentStyle={styles.dropdownButton}
                                icon={() => <Icon name="arrow-drop-down" size={20} color="#656464" />}
                                labelStyle={styles.placeholderText}
                                style={styles.Button}
                            >
                                {motivo ? motivo : 'Selecciona el motivo de la cita'}
                            </Button>
                        }
                    >
                        {motivosList.map((item) => (
                            <Menu.Item
                                key={item.id}
                                onPress={() => {
                                    setMotivo(item.motivo)
                                    setMotivoId(item.id!)
                                    setVisibleMotivo(false);
                                }}
                                title={item.motivo}
                            />
                        ))}
                    </Menu>
                    <Text style={styles.label}>Veterinario</Text>
                    <Menu
                        visible={visibleVeterinario}
                        onDismiss={() => setVisibleVeterinario(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setVisibleVeterinario(true)}
                                contentStyle={styles.dropdownButton}
                                icon={() => <Icon name="arrow-drop-down" size={20} color="#656464" />}
                                labelStyle={styles.placeholderText}
                                style={styles.Button}
                            >
                                {veterinario ? veterinario : 'Selecciona un veterinario'}
                            </Button>
                        }
                    >
                        {veterinarias.map((item) => (
                            <Menu.Item
                                key={item.id}
                                onPress={() => {
                                    setVeterinario(item.nombre);
                                    setVeterinarioId(item.id!)
                                    setVisibleVeterinario(false);
                                }}
                                title={item.nombre}
                            />
                        ))}
                    </Menu>
                    {/* Estatus */}
                    <Text style={styles.label}>Estatus</Text>
                        <Menu
                            visible={visibleStatus}
                            onDismiss={() => setVisibleStatus(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    onPress={() => setVisibleStatus(true)}
                                    contentStyle={styles.dropdownButton}
                                    icon={() => <Icon name="arrow-drop-down" size={20} color="#656464" />}
                                    labelStyle={styles.placeholderText}
                                    style={styles.Button}
                                >
                                    {selectedStatus ? selectedStatus : 'Selecciona el estatus'}
                                </Button>
                            }
                        >
                        {estatusList.map((item) => (
                            <Menu.Item                                  
                            key={item.id}
                                onPress={() => {
                                    setSelectedStatus(item.estatus);
                                    setSelectedStatusId(item.id)
                                    setVisibleStatus(false);
                                }}
                                title={item.estatus}
                            />
                        ))}
                    </Menu>

                    {/* Calendario */}
                    <Text style={styles.label}>Fecha</Text>
                    <Calendar
                        onDayPress={(day:any) => {
                            setSelectedDate(day.dateString);
                        }}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                selectedColor: '#1e90ff',
                            },
                        }}
                        theme={{
                            arrowColor: '#1e90ff',
                            todayTextColor: '#1e90ff',
                            selectedDayBackgroundColor: '#1e90ff',
                            textDayFontFamily: 'Urbanist-Regular',
                            textMonthFontFamily: 'Urbanist-Bold',
                            textDayHeaderFontFamily: 'Urbanist-Bold',
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14,
                        }}
                        style={[styles.calendar, {width: 320}]}
                    />

                    {/* Hora */}
                    <Text style={[styles.label, {marginTop: 15}]}>Hora</Text>
                    <View style={styles.timePickerContainer}>
                        <Text style={styles.timeText}>{formattedTime}</Text>
                        <Icon
                            name="access-time"
                            size={24}
                            color="#656464"
                            onPress={() => setShowTimePicker(true)}
                        />
                    </View>

                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display="default"
                            onChange={onChangeTime}
                        />
                    )}
                    
                    <TouchableOpacity><Button mode="outlined" style={[styles.button, styles.outlinedButton]} textColor="#00635D" onPress={handleGuardarCita}>Confirmar cita</Button></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contenedor: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingHorizontal: 20,
    },
    appBar: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        right: 35,
        textAlign: 'center',
        fontSize: 26,
        color: '#00635D',
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 15,
        color: '#656464',
        fontWeight: '200',
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
        fontSize: 14,
        color: '#656464',
        marginBottom: 5,
    },
    dropdownButton: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: '100%',
    },
    placeholderText: {
        color: '#656464',
        textAlign: 'left',
    },
    Button: {
        borderColor: '#CFD3D4',
        width: '90%',
        borderRadius: 10,
        marginBottom: 10,
    },
    calendar: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 10,
    },
    timePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    timeText: {
        fontSize: 16,
        color: '#656464',
    },
    button: {
        marginTop: 15,
        width: 270,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#004E49',
        marginBottom: 20
    },
    outlinedButton: {
        borderColor: '#004E49',
        backgroundColor: 'transparent',
        
    },
});
