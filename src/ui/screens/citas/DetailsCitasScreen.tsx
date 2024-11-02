import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Avatar, Text, IconButton, Button } from 'react-native-paper';
import MapView from 'react-native-maps';
import { RootStackParams } from "../../routes/StackNavigator";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const profileImage = require('../../../assets/Profile.jpg');
type DetailsCitasScreenProp = RouteProp<RootStackParams, 'DetailsCitasScreen'>;

export const DetailsCitasScreen = () => {
    const [notas, setNotas] = useState('');
    const route = useRoute<DetailsCitasScreenProp>();
    const navigation = useNavigation();
    const { cita }: any = route.params;

    const [fecha, hora] = cita.fecha ? cita.fecha.split(" - ") : ["Fecha no disponible", "Hora no disponible"];

    return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            iconColor="#00635D"
            size={25}
            style={{marginLeft: -5}}
          />
          <Text style={styles.title}>Detalles</Text>
        </View>

        {/* Información de la mascota sin contenedor */}
        <View style={styles.petInfo}>
          <Avatar.Image
            size={150}
            source={profileImage}
            style={styles.petImage}
          />
          <View style={styles.petDetails}>
            <Text style={styles.petName}>
              {" "}
              <Icon name="paw" size={30} color="#656464" /> {cita.mascota}
            </Text>
            <View style={styles.attributeRow}>
              <Text style={styles.attribute}>ℹ️ {cita.peso}kg</Text>
              <Text style={styles.attribute}>ℹ️ {cita.altura} CM</Text>
            </View>
          </View>
        </View>

        {/* Detalles de la cita */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Motivo:</Text>
            <Text style={styles.value}>{cita.motivo}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Veterinaria:</Text>
            <Text style={styles.value}>{cita.veterinaria}</Text>
          </View>
        </View>

        {/* Fecha y hora */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateCard}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{fecha}</Text>
          </View>

          <View style={styles.dateCard}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>{hora}</Text>
          </View>
        </View>

        {/* Ubicación */}
        <Text style={styles.sectionTitle}>Ubicación</Text>
        <View style={styles.mapCard}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 52.4862, // Coordenadas de ejemplo
              longitude: -1.8904,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          />
        </View>

        <View style={styles.container2}>
          <Text style={styles.label2}>Notas adicionales:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            multiline
            maxLength={100}
            value={notas}
            onChangeText={setNotas}
          />
          <Text style={styles.counter}>{`${notas.length}/100`}</Text>
          <Button
            mode="outlined"
            onPress={() => console.log("Guardar presionado")}
            style={styles.button}
            labelStyle={{color: '#00635D'}}
          >
            Guardar
          </Button>
        </View>
      </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    container2: {
        marginTop: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 15
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00635D',
        flex: 1,
        textAlign: 'center',
        marginRight: 40,
    },
    petInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingLeft: 15
    },
    petImage: {
        backgroundColor: '#FFE6BD',
        borderRadius: 16,
    },
    petDetails: {
        marginLeft: 15,
    },
    petName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    attributeRow: {
        flexDirection: 'column',
        fontSize: 100,
        marginTop: 5,
        paddingLeft: 10
    },
    attribute: {
        fontSize: 14,
        color: '#656464',
        marginTop: 3,
    },
    infoContainer: {
        marginVertical: 10,
    },
    infoCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#656464',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    dateCard: {
        width: '48%',
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    mapCard: {
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    label2: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 100,
        width: '100%',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
    },
    counter: {
        alignSelf: 'flex-end',
        marginTop: 4,
        color: '#aaa',
    },
    button: {
        marginTop: 15,
        borderRadius: 20,
        borderColor: '#00635D',
        width: 250,
    },
});
