import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialIcons';

export const FormCitasScreen = () => {
    const [veterinario, setVeterinario] = useState('');
    const [motivo, setMotivo] = useState('');
    const [visibleVeterinario, setVisibleVeterinario] = useState(false);
    const [visibleMotivo, setVisibleMotivo] = useState(false);

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Agregar Cita</Text>
                <Text style={styles.subtitle}>Registra las citas de tu mascota</Text>

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

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    title: {
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
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 8,
        width: '90%',
    },
    placeholderText: {
        color: '#656464',
        textAlign: 'left',
    }
});
