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
import { getMascotasByUserId, updateVacuna } from '../../../actions/profile/profile';
import { IMascotas } from '../../../interfaces/Mascota/IMascota';

interface VacunaModalProps {
    visible: boolean;
    onDismiss: () => void;
    onRefresh: () => void;
    vacunaSeleccionada?: IVacunas | null; 
}

export const VacunaModal: React.FC<VacunaModalProps> = ({ visible, onDismiss, onRefresh, vacunaSeleccionada }) => {
    const [vacuna, setVacuna] = useState('');
    const [vacunaId, setVacunaId] = useState('');
    const [visibleVacuna, setVisibleVacuna] = useState(false);

    const [mascota, setMascota] = useState('');
    const [visibleMascota, setVisibleMascota] = useState(false);

    const [estatusList, setEstatusList] = useState<IEstatus[]>([]);
    const [visibleStatus, setVisibleStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedStatusId, setSelectedStatusId] = useState<string>('');

    const [selectedDate, setSelectedDate] = useState('');
    const [time, setTime] = useState<Date | null>(null);
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
            const response = await getTipoMascota();
            setEspecie(response);
        };

        const fetchEstatus = async () => {
            const estatusData = await getEstatus();
            setEstatusList(estatusData);
        };

        const fetchMascotas = async () => {
            if (userId) {
                const mascotasData = await getMascotasByUserId(userId);
                setMascotas(mascotasData.data || []);
            }
        };

        fetchData();
        fetchEstatus();
        fetchMascotas();
    }, [userId]);

    useEffect(() => {
        const fetchVacunas = async () => {
            if (selectedEspecieId) {
                const vacunasData = await geVacunasTipoMascota(selectedEspecieId);
                setVacunas(vacunasData);
                
                if (!vacunaSeleccionada || selectedEspecieId !== vacunaSeleccionada.idVacunasTipoMascota) {
                    setVacuna('');
                    setVacunaId('');
                }
            }
        };

        fetchVacunas();
    }, [selectedEspecieId, vacunaSeleccionada]);

    useEffect(() => {
        if (vacunaSeleccionada) {
            setVacuna(vacunaSeleccionada.nombreVacuna);
            setSelectedDate(vacunaSeleccionada.fechaAplicacion);
            
            const horaAplicacion = new Date(`1970-01-01T${vacunaSeleccionada.horaAplicacion}`);
            setTime(isNaN(horaAplicacion.getTime()) ? new Date() : horaAplicacion);

            setSelectedStatusId(vacunaSeleccionada.idStatus);
            setSelectedStatus(estatusList.find((estatus) => estatus.id === vacunaSeleccionada.idStatus)?.estatus || '');
            setVacunaId(vacunaSeleccionada.idVacunasTipoMascota);
            setMascota(mascotas.find((m) => m.id === vacunaSeleccionada.idMascota)?.nombreMascota || '');
            setSelectedEspecieId(vacunaSeleccionada.idVacunasTipoMascota);
        } else {
            resetFields();
        }
    }, [vacunaSeleccionada, estatusList, mascotas]);

    const resetFields = () => {
        setVacuna('');
        setVacunaId('');
        setSelectedDate('');
        setTime(new Date());
        setSelectedStatus('');
        setSelectedStatusId('');
        setMascota('');
    };

    const onChangeTime = (event: any, selectedTime: Date | undefined) => {
        if (selectedTime) {
            setTime(selectedTime);
        }
        setShowTimePicker(false);
    };

    const formattedTime = time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

    const handleGuardar = async () => {
        if (!mascota || !vacuna || !selectedDate || !selectedStatus) {
            Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
            return;
        }

        const idMascota = mascotas.find(m => m.nombreMascota === mascota)?.id || '';
        const idVacunasTipoMascota = vacunaId;

        const vacunaData: IVacunas = {
            id: vacunaSeleccionada ? vacunaSeleccionada.id : '',
            nombreVacuna: vacuna,
            fechaAplicacion: new Date(selectedDate).toISOString(),
            horaAplicacion: formattedTime,
            idStatus: selectedStatusId,
            idMascota: idMascota,
            idVacunasTipoMascota: idVacunasTipoMascota,
        };

        try {
            if (vacunaSeleccionada) {
                const response = await updateVacuna(vacunaSeleccionada.id!, vacunaData);
                console.log('datos a mandar: ', vacunaData)
                if (response) {
                    Alert.alert("Éxito", "Vacuna actualizada con éxito");
                } else {
                    Alert.alert("Error", "No se pudo actualizar la vacuna");
                }
            } else {
                const response = await PostVacunasMascora(vacunaData);
                if (response.isSuccess) {
                    Alert.alert("Éxito", "Vacuna registrada con éxito");
                } else {
                    Alert.alert("Error", response.message || "No se pudo registrar la vacuna");
                }
            }
            onRefresh();
            onDismiss();
        } catch (error) {
            console.error("Error al guardar la vacuna:", error);
            Alert.alert("Error", "Hubo un problema al guardar la vacuna");
        }
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <ScrollView>
                    <Text style={styles.modalTitle}>{vacunaSeleccionada ? 'Editar Vacuna' : 'Agregar Vacuna'}</Text>
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
                                        setSelectedEspecieId(item.id);
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
                                        setVacunaId(item.id);
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
                            <DateTimePicker value={time || new Date()} mode="time" display="default" onChange={onChangeTime} />
                        )}

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
                                        setSelectedStatusId(item.id);
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
