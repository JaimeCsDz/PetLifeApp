import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, Alert } from 'react-native';
import { Modal, Portal, Button, Text, Menu, TextInput } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getTipoMascota, getEstatus, geVacunasTipoMascota, PostVacunasMascora } from '../../../actions/vacunas/vacunas';
import { ITipoMascota } from '../../../interfaces/Mascota/ITipoMascota';
import { IVacunas } from '../../../interfaces/vacunas/IVacunas';
import { IEstatus } from '../../../interfaces/vacunas/IEstatus';
import { IVacunaTipo } from '../../../interfaces/vacunas/IVacunaTipo';
import { useAuthStore } from '../../../store/useAuthStore';
import { getMascotasByUserId } from '../../../actions/profile/profile';
import { IMascotas } from '../../../interfaces/Mascota/IMascota';

interface VacunaModalProps {
    visible: boolean;
    onDismiss: () => void;
    onRefresh: () => void;
}

export const VacunaModal: React.FC<VacunaModalProps> = ({ visible, onDismiss, onRefresh }) => {
    const [vacuna, setVacuna] = useState('');
    const [vacunaId, setVacunaId] = useState('');
    const [visibleVacuna, setVisibleVacuna] = useState(false);
    
    const [notas, setNotas] = useState('');
    
    const [mascota, setMascota] = useState('');
    const [visibleMascota, setVisibleMascota] = useState(false);

    const [estatusList, setEstatusList] = useState<IEstatus[]>([]);
    const [visibleStatus, setVisibleStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedStatusId, setSelectedStatusId] = useState<string>('');

    const [selectedDate, setSelectedDate] = useState('');
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [especie, setEspecie] = useState<ITipoMascota[]>([]);
    const [selectedEspecie, setSelectedEspecie] = useState<string>('');
    const [selectedEspecieId, setSelectedEspecieId] = useState<string>('');
    const [visibleEspecie, setVisibleEspecie] = useState(false);

    const [mascotas, setMascotas] = useState<IMascotas[]>([]);
    const [vacunas, setVacunas] = useState<IVacunaTipo[]>([]);

    const { userId } = useAuthStore();

    useEffect(() => {
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

        const fetchEstatus = async () => {
            try {
                const estatusData = await getEstatus();
                setEstatusList(estatusData);
            } catch (error) {
                Alert.alert("Error", "No se pudo obtener los estados.");
                console.error("Error al obtener los estados:", error);
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

        fetchData();
        fetchEstatus();
        fetchMascotas();
    }, [userId]);

    useEffect(() => {
        const fetchVacunas = async () => {
            try {
                if (selectedEspecieId) {
                    const vacunasData = await geVacunasTipoMascota(selectedEspecieId);
                    setVacunas(vacunasData);
                    setVacuna('');
                }
            } catch (error) {
                Alert.alert("Error", "No se pudieron obtener las vacunas para la especie seleccionada.");
                console.error("Error al obtener las vacunas:", error);
            }
        };

        fetchVacunas();
    }, [selectedEspecie]);

    const onChangeTime = (event: any, selectedTime: any) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const handleGuardar = async () => {
        if (!mascota || !vacuna || !selectedDate || !selectedStatus) {
            Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
            return;
        }
    
        const idMascota = mascotas.find(mascotas => mascotas.nombreMascota === mascota)?.id || '';
    
        const vacunaSeleccionada = vacunas.find(vacunas => vacunas.id === vacunaId);
        const idVacunasTipoMascota = vacunaSeleccionada ? vacunaSeleccionada.id : '';
    
        if (!idMascota) {
            Alert.alert("Error", "Por favor, selecciona una mascota válida.");
            return;
        }
        if (!idVacunasTipoMascota) {
            Alert.alert("Error", "Por favor, selecciona una vacuna válida.");
            return;
        }
    
        const vacunaData: IVacunas = {
            nombreVacuna: vacunaSeleccionada!.nombreVacuna,
            fechaAplicacion: new Date(selectedDate).toISOString(),
            horaAplicacion: formattedTime,
            idStatus: selectedStatusId,
            idMascota: idMascota,
            idVacunasTipoMascota: idVacunasTipoMascota,
        };
    
        console.log('Datos a enviar:', vacunaData);
    
        try {
            const response = await PostVacunasMascora(vacunaData);
            if (response.isSuccess) {
                Alert.alert("Éxito", "Vacuna registrada con éxito");
                onRefresh()
                onDismiss();
            } else {
                Alert.alert("Error", response.message || "No se pudo registrar la vacuna");
            }
        } catch (error) {
            console.error("Error al registrar la vacuna:", error);
            Alert.alert("Error", "Hubo un problema al registrar la vacuna");
        }
    };
    
        

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <ScrollView>
                    <Text style={styles.modalTitle}>Agregar vacuna</Text>
                    <View style={styles.contenedor2}>
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
                                    {mascota ? mascota : 'Selecciona tu mascota'}
                                </Button>
                            }
                        >
                            {mascotas.map((item) => (
                                <Menu.Item
                                    key={item.id}
                                    onPress={() => {
                                        setMascota(item.nombreMascota);
                                        setVisibleMascota(false);
                                    }}
                                    title={item.nombreMascota}
                                />
                            ))}
                        </Menu>

                        <Text style={styles.label}>Vacuna</Text>
                        <Menu
                            visible={visibleVacuna}
                            onDismiss={() => setVisibleVacuna(false)}
                            anchor={
                                <Button
                                    mode="outlined"
                                    onPress={() => setVisibleVacuna(true)}
                                    contentStyle={styles.dropdownButton}
                                    icon={() => <Icon name="arrow-drop-down" size={20} color="#656464" />}
                                    labelStyle={styles.placeholderText}
                                    style={styles.Button}
                                >
                                    {vacuna ? vacuna : 'Selecciona el tipo de vacuna'}
                                </Button>
                            }
                        >
                            {vacunas.map((item) => (
                                <Menu.Item
                                    key={item.id}
                                    onPress={() => {
                                        setVacuna(item.nombreVacuna);
                                        setVacunaId(item.id)
                                        setVisibleVacuna(false);
                                    }}
                                    title={item.nombreVacuna}
                                />
                            ))}
                        </Menu>

                        <Text style={styles.label}>Fecha aplicación</Text>
                        <Calendar
                            onDayPress={(day: any) => setSelectedDate(day.dateString)}
                            markedDates={{
                                [selectedDate]: {
                                    selected: true,
                                    selectedColor: '#1e90ff',
                                },
                            }}
                            style={[styles.calendar, { width: 270 }]}
                        />

                        <Text style={[styles.label, { marginTop: 15 }]}>Hora aplicación</Text>
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
                            <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} />
                        )}

                        <Text style={styles.label}>Status</Text>
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
                    </View>
                </ScrollView>
                <View style={styles.botones}>
                    <Button onPress={onDismiss} style={styles.closeButton} textColor="#ffffff">
                        Cerrar
                    </Button>
                    <Button onPress={handleGuardar} style={styles.closeButton} textColor="#ffffff">
                        Guardar
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#00635D',
        width: 90,
        margin: 10,
    },
    contenedor2: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingHorizontal: 20,
    },
    label: {
        alignSelf: 'flex-start',
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
        width: '100%',
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
        width: '100%',
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
    textInput: {
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    botones: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
