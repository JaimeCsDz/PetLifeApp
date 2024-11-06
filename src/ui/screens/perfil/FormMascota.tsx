import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { Appbar, Button, Menu, TextInput, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import { RootStackParams } from '../../routes/StackNavigator';
import { getRaza, getTipoMascota, getGeneros, registerMasc} from '../../../actions/profile/profile'
import { useAuthStore } from "../../../store/useAuthStore";
import { IMascotas } from "../../../interfaces/Mascota/IMascota";
import { IRaza } from "../../../interfaces/Mascota/IRaza";
import { ITipoMascota } from "../../../interfaces/Mascota/ITipoMascota";
import { IGenero } from "../../../interfaces/Mascota/IGenero";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebaseConfig'

export const FormMascota = () => {
    const [nombreMascota, setNombreMascota] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [genero, setGenero] = useState('');
    const [generoId, setGeneroId] = useState('');
    const [visibleGenero, setVisibleGenero] = useState(false);
    const [tipoMascota, setTipoMascota] = useState('');
    const [tipoMascotaId, setTipoMascotaId] = useState('');
    const [visibleTipoMascota, setVisibleTipoMascota] = useState(false);
    const [raza, setRaza] = useState('');
    const [razaid, setRazaId] = useState('');
    const [visibleRaza, setVisibleRaza] = useState(false);
    const [image, setImage] = useState('')
    const [razas, setRazas] = useState<IRaza[]>([]);
    const [razasFiltradas, setRazasFiltradas] = useState<IRaza[]>([]);
    const [tiposMascotas, setTiposMascota] = useState<ITipoMascota[]>([]);
    const [Generos, setGeneros] = useState<IGenero[]>([]);

    const navigation = useNavigation()
    const { userId,  } = useAuthStore();
    if (!userId) {
        console.error("Error: El id del usuario no está definido.");
        return;
    }


    useEffect(() => {
        const fetchData = async () => {
            const razaData = await getRaza();
            setRazas(razaData);
    
            const tipoMascotaData = await getTipoMascota();
            setTiposMascota(tipoMascotaData);
    
            const generoData = await getGeneros();
            setGeneros(generoData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (tipoMascotaId) {
            const razasDelTipo = razas.filter((raza) => raza.idTipoMascota === tipoMascotaId);
            setRazasFiltradas(razasDelTipo);
        } else {
            setRazasFiltradas(razas);
        }
    }, [tipoMascotaId, razas]);

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

    const handleRegister = async () => {
        if (!nombreMascota || !peso || !altura || !fechaNacimiento || !genero) {
            Alert.alert('Aviso', 'Debes completar todos los campos');
            return;
        }
    
        try {
            let imageUrl = image;
    
            if (image.startsWith('file://')) {
                const imageName = `${userId}_${Date.now()}.jpg`;
    
                const imageRef = ref(storage, `mascotas/${imageName}`);
    
                const response = await fetch(image);
                const blob = await response.blob();
    
                await uploadBytes(imageRef, blob);
    
                imageUrl = await getDownloadURL(imageRef);
            }
    
            const data: IMascotas = {
                idUsuario: userId,
                nombreMascota: nombreMascota,
                altura: parseFloat(altura),
                fechaNacimiento: new Date(fechaNacimiento).toISOString(),
                peso: parseFloat(peso),
                idGenero: generoId,
                idRazaMascota: razaid,
                idTipoMascota: tipoMascotaId,
                fotoMascota: imageUrl
            };
    
            console.log("Datos a enviar:", data);
            const response = await registerMasc(data);
            if (response.isSuccess && response.data) {
                navigation.goBack()
                Alert.alert("Mascota creada correctamente");
            }
        } catch (error) {
            console.log("Ocurrió un error al guardar la mascota", error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Appbar.Header style={{ backgroundColor: '#ffffff' }}>
                <TouchableOpacity>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color="#00635D" size={25}/>
                </TouchableOpacity>
                <Appbar.Content title="Registrar Mascota" titleStyle={{ color: '#00635D', textAlign: 'center', marginLeft: -50}} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>
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
                    activeOutlineColor="#00635D"
                    style={styles.input}
                    outlineColor="#00635D"
                />

                <TextInput
                    label="Peso (kg)"
                    value={peso}
                    onChangeText={setPeso}
                    keyboardType="numeric"
                    activeOutlineColor="#00635D"
                    mode="outlined"
                    style={styles.input}
                    outlineColor="#00635D"
                />

                <TextInput
                    label="Altura (cm)"
                    value={altura}
                    onChangeText={setAltura}
                    keyboardType="numeric"
                    activeOutlineColor="#00635D"
                    mode="outlined"
                    style={styles.input}
                    outlineColor="#00635D"
                />

                <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                    textColor="#656464"
                    style={{ borderColor: '#00635D', marginBottom: 16, borderRadius: 8, height: 50 }}
                    labelStyle={{textAlign: 'center'}}
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

                <Text>Género</Text>
                <Menu
                    visible={visibleGenero}
                    onDismiss={() => setVisibleGenero(false)}
                    anchor={
                        <Button mode="outlined" onPress={() => setVisibleGenero(true)} textColor="#00635D" style={{ borderColor: '#00635D', marginTop: 8, borderRadius: 8, height: 45 }}>
                            {genero || 'Selecciona el género'}
                        </Button>
                    }
                >
                    {Generos.map((item) => (
                        <Menu.Item
                            key={item.id}
                            onPress={() => {
                                setGenero(item.genero);
                                setGeneroId(item.id)
                                setVisibleGenero(false);
                            }}
                            title={item.genero} 
                        />
                    ))}
                </Menu>

                <Text style={{ marginTop: 10}}>Tipo de Mascota</Text>
                <Menu
                    visible={visibleTipoMascota}
                    onDismiss={() => setVisibleTipoMascota(false)}
                    anchor={
                        <Button mode="outlined" onPress={() => setVisibleTipoMascota(true)} textColor="#00635D" style={{ borderColor: '#00635D', marginTop: 8, borderRadius: 8, height: 45 }}>
                            {tipoMascota || 'Selecciona el tipo de mascota'}
                        </Button>
                    }
                >
                    {tiposMascotas.map((item) => (
                        <Menu.Item
                            key={item.id}
                            onPress={() => {
                                setTipoMascota(item.tipo);
                                setTipoMascotaId(item.id)
                                setVisibleTipoMascota(false);
                            }}
                            title={item.tipo}
                        />
                    ))}
                </Menu>

                <Text>Raza mascota</Text>
                <Menu
                    visible={visibleRaza}
                    onDismiss={() => setVisibleRaza(false)}
                    
                    anchor={
                        <Button mode="outlined" onPress={() => setVisibleRaza(true)} textColor="#00635D" style={{ borderColor: '#00635D', marginTop: 8, borderRadius: 8, height: 45 }}>
                            {raza || 'Selecciona la raza'}
                        </Button>
                    }
                >
                    {razasFiltradas.map((item) => (
                        <Menu.Item
                            key={item.id}
                            onPress={() => {
                                setRaza(item.razaMascota);
                                setRazaId(item.id)
                                setVisibleRaza(false);
                            }}
                            title={item.razaMascota}
                        />
                    ))}
                </Menu>

                <Button
                    mode="contained"
                    onPress={handleRegister}
                    style={{ backgroundColor: '#00635D', marginTop: 20 }}
                >
                    Registrar Mascota
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 40,
        paddingBottom: 20,
    },
    input: {
        marginBottom: 16,
        width: '100%',
    }
});

export default FormMascota;
