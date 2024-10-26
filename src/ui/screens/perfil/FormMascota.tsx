import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Button, Menu, TextInput, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export const FormMascota = () => {
    const [nombreMascota, setNombreMascota] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [genero, setGenero] = useState('');
    const [visibleGenero, setVisibleGenero] = useState(false);
    const [tipoMascota, setTipoMascota] = useState('');
    const [visibleTipoMascota, setVisibleTipoMascota] = useState(false);
    const [raza, setRaza] = useState('');
    const [image, setImage] = useState('')
    
    const generos = [
        { label: 'Hembra', value: 'hembra' },
        { label: 'Macho', value: 'macho' },
        { label: 'Otro', value: 'otro' },
    ];

    const tiposMascota = [
        { label: 'Perro', value: 'perro' },
        { label: 'Gato', value: 'gato' },
        { label: 'Hamster', value: 'hamster' },
        { label: 'Otro', value: 'otro' },
    ];

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleDateChange = (event:any, selectedDate:any) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setFechaNacimiento(formattedDate);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <ScrollView>
                <View style={{ padding: 20 }}>
                    <Appbar.Header>
                        <Appbar.BackAction onPress={() => {}} color="#00635D" />
                        <Appbar.Content title="Registrar Mascota" titleStyle={{ color: '#00635D' }} />
                    </Appbar.Header>

                    <TouchableOpacity onPress={selectImage} style={{ alignItems: 'center', marginVertical: 20 }}>
                        {image ? (
                            <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        ) : (
                            <Button mode="outlined" icon="camera" textColor="#00635D" style={{ borderColor: '#00635D' }}>
                                Subir Foto
                            </Button>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        label="Nombre de la mascota"
                        value={nombreMascota}
                        onChangeText={setNombreMascota}
                        mode="outlined"
                        style={{ marginBottom: 16 }}
                        outlineColor="#00635D"
                    />

                    <TextInput
                        label="Peso (kg)"
                        value={peso}
                        onChangeText={setPeso}
                        keyboardType="numeric"
                        mode="outlined"
                        style={{ marginBottom: 16 }}
                        outlineColor="#00635D"
                    />

                    <TextInput
                        label="Altura (cm)"
                        value={altura}
                        onChangeText={setAltura}
                        keyboardType="numeric"
                        mode="outlined"
                        style={{ marginBottom: 16 }}
                        outlineColor="#00635D"
                    />

                    <Button
                        mode="outlined"
                        onPress={() => setShowDatePicker(true)}
                        textColor="#00635D"
                        style={{ borderColor: '#00635D', marginBottom: 16 }}
                    >
                        {fechaNacimiento ? `Fecha de Nacimiento: ${fechaNacimiento}` : 'Seleccionar Fecha de Nacimiento'}
                    </Button>

                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Género */}
                    <Text style={{ marginTop: 16 }}>Género</Text>
                    <Menu
                        visible={visibleGenero}
                        onDismiss={() => setVisibleGenero(false)}
                        anchor={
                            <Button mode="outlined" onPress={() => setVisibleGenero(true)} textColor="#00635D" style={{ borderColor: '#00635D', marginTop: 8 }}>
                                {genero || 'Selecciona el género'}
                            </Button>
                        }
                    >
                        {generos.map((item) => (
                            <Menu.Item
                                key={item.value}
                                onPress={() => {
                                    setGenero(item.label);
                                    setVisibleGenero(false);
                                }}
                                title={item.label}
                            />
                        ))}
                    </Menu>

                    {/* Tipo de Mascota */}
                    <Text style={{ marginTop: 16 }}>Tipo de Mascota</Text>
                    <Menu
                        visible={visibleTipoMascota}
                        onDismiss={() => setVisibleTipoMascota(false)}
                        anchor={
                            <Button mode="outlined" onPress={() => setVisibleTipoMascota(true)} textColor="#00635D" style={{ borderColor: '#00635D', marginTop: 8 }}>
                                {tipoMascota || 'Selecciona el tipo de mascota'}
                            </Button>
                        }
                    >
                        {tiposMascota.map((item) => (
                            <Menu.Item
                                key={item.value}
                                onPress={() => {
                                    setTipoMascota(item.label);
                                    setVisibleTipoMascota(false);
                                }}
                                title={item.label}
                            />
                        ))}
                    </Menu>

                    <TextInput
                        label="Raza de la mascota"
                        placeholder="Ej. Labrador"
                        value={raza}
                        onChangeText={setRaza}
                        mode="outlined"
                        style={{ marginBottom: 16 }}
                        outlineColor="#00635D"
                    />

                    <Button
                        mode="contained"
                        onPress={() => {
                            // Aquí puedes manejar el envío de los datos del formulario
                        }}
                        style={{ backgroundColor: '#00635D', marginTop: 20 }}
                    >
                        Registrar Mascota
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default FormMascota;
