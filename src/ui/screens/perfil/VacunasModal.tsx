import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, Alert } from 'react-native';
import { Modal, Portal, Button, Text, Menu, TextInput } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getTipoMascota } from '../../../actions/vacunas/vacunas';
import { ITipoMascota } from '../../../interfaces/Mascota/ITipoMascota';

interface VacunaModalProps {
    visible: boolean;
    onDismiss: () => void;
}

export const VacunaModal: React.FC<VacunaModalProps> = ({ visible, onDismiss }) => {
    const [veterinario, setVeterinario] = useState('');
    const [motivo, setMotivo] = useState('');
    const [notas, setNotas] = useState('');
    const [visibleVeterinario, setVisibleVeterinario] = useState(false);
    const [visibleMotivo, setVisibleMotivo] = useState(false);
    const [visibleStatus, setVisibleStatus] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [especie, setEspecie] = useState<ITipoMascota[]>([]);
    const [selectedEspecie, setSelectedEspecie] = useState<string>('');
    const [visibleEspecie, setVisibleEspecie] = useState(false);

    const mascotas = [
        { label: 'Mascota A', value: 'mascotaA' },
        { label: 'Mascota B', value: 'mascotaB' },
        { label: 'Mascota C', value: 'mascotaC' },
    ];

    const vacunas = [
        { label: 'Rabia', value: 'rabia' },
        { label: 'Polivalente', value: 'polivalente' },
        { label: 'Moquillo', value: 'moquillo' },
    ];

    const status = [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Aplicada', value: 'aplicada' },
        { label: 'Faltante', value: 'faltante' },
    ];
    
    useEffect(()=>{
        const fetchTipo = async () => {
            try {
                const response = await getTipoMascota()
                if(response.length > 0){
                    setEspecie(response)
                }else{
                    Alert.alert("Error", "No se encontraron tipos de mascotas")
                }
            } catch (error) {
                Alert.alert('Error', 'Ocurrio un error al cargar los datos')
            }
        }

        fetchTipo()
    }, [])

    const onChangeTime = (event: any, selectedTime: any) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

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
                                        setVisibleEspecie(false);
                                    }}
                                    title={item.tipo}
                                />
                            ))}
                        </Menu>

                        <Text style={styles.label}>Mascota</Text>
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
                                    {veterinario ? veterinario : 'Selecciona tú mascota'}
                                </Button>
                            }
                        >
                            {mascotas.map((item) => (
                                <Menu.Item
                                    key={item.value}
                                    onPress={() => {
                                        setVeterinario(item.label);
                                        setVisibleVeterinario(false);
                                    }}
                                    title={item.label}
                                />
                            ))}
                        </Menu>

                        <Text style={styles.label}>Vacuna</Text>
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
                                    {motivo ? motivo : 'Selecciona el tipo de vacuna'}
                                </Button>
                            }
                        >
                            {vacunas.map((item) => (
                                <Menu.Item
                                    key={item.value}
                                    onPress={() => {
                                        setMotivo(item.label);
                                        setVisibleMotivo(false);
                                    }}
                                    title={item.label}
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
                                    {'Selecciona el estatus'}
                                </Button>
                            }
                        >
                            {status.map((item) => (
                                <Menu.Item
                                    key={item.value}
                                    onPress={() => {
                                        setVeterinario(item.label);
                                        setVisibleVeterinario(false);
                                    }}
                                    title={item.label}
                                />
                            ))}
                        </Menu>

                        <Text style={styles.label}>Notas adicionales</Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Añade cualquier observación o nota"
                            value={notas}
                            onChangeText={setNotas}
                            multiline
                            numberOfLines={4}
                            style={styles.textInput}
                        />
                    </View>
                </ScrollView>
                <View style={styles.botones}>
                    <Button onPress={onDismiss} style={styles.closeButton} textColor="#ffffff">
                        Cerrar
                    </Button>
                    <Button onPress={onDismiss} style={styles.closeButton} textColor="#ffffff">
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
        backgroundColor: '#fff'
    },
    botones: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
