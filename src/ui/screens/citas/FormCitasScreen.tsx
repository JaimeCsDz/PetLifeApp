import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Text, Button, Menu, Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";


export const FormCitasScreen = () => {
    const [veterinario, setVeterinario] = useState('');
    const [motivo, setMotivo] = useState('');
    const [visibleVeterinario, setVisibleVeterinario] = useState(false);
    const [visibleMotivo, setVisibleMotivo] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const navigation = useNavigation()

    const veterinarios = [
        { label: 'Veterinario A', value: 'veterinarioA' },
        { label: 'Veterinario B', value: 'veterinarioB' },
        { label: 'Veterinario C', value: 'veterinarioC' },
    ];

    const motivos = [
        { label: 'Consulta general', value: 'consultaGeneral' },
        { label: 'Vacunación', value: 'vacunacion' },
        { label: 'Emergencia', value: 'emergencia' },
    ];

    const onChangeTime = (event:any, selectedTime:any) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

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
                    {/* Veterinario */}
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
                        {veterinarios.map((item) => (
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
                        {motivos.map((item) => (
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
                    
                    <TouchableOpacity><Button mode="outlined" style={[styles.button, styles.outlinedButton]} textColor="#00635D">Confirmar Cita</Button></TouchableOpacity>
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
        right: 25,
        textAlign: 'center',
        fontSize: 26,
        color: '#00635D',
        fontWeight: 'bold',
        marginBottom: 10,
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
