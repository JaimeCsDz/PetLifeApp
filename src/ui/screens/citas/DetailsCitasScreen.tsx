import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Text, IconButton, Button, Menu, Appbar } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParams } from "../../routes/StackNavigator";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icono from 'react-native-vector-icons/MaterialIcons';
import { DeleteCita, getEstatus, getVeterinarias, updateCita } from '../../../actions/citas/citas';
import { IEstatus } from '../../../interfaces/vacunas/IEstatus';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type DetailsCitasScreenProp = RouteProp<RootStackParams, 'DetailsCitasScreen'>;

export const DetailsCitasScreen = () => {
  const route = useRoute<DetailsCitasScreenProp>();
  const navigation = useNavigation();
  const { cita }: any = route.params;
  const [notas, setNotas] = useState(cita.notaAdicional || '');
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [estatusList, setEstatusList] = useState<IEstatus[]>([]);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(cita.estatu || '');
  const [selectedStatusId, setSelectedStatusId] = useState<string>(cita.estatuId || '');
  const [menuVisible, setMenuVisible] = useState(false);


  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);


  useEffect(() => {
    const fetchVeterinarias = async () => {
      try {
        const veterinarias = await getVeterinarias();
        const veterinaria = veterinarias.find(v => v.nombre === cita.veterinaria);
        if (veterinaria) {
          setLatitud(veterinaria.latitud);
          setLongitud(veterinaria.longitud);
        } else {
          console.error("Veterinaria no encontrada:", cita.veterinaria);
        }
      } catch (error) {
        console.error("Error al obtener las veterinarias:", error);
      }
    };

    fetchVeterinarias();
  }, [cita.veterinaria]);

  useEffect(() => {
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
}, []);

const handleUpdateCita = async () => {
  try {
    await updateCita(cita.id, { estatu: selectedStatusId, notaAdicional: notas });
    Alert.alert("Éxito", "La cita se ha actualizado correctamente.");
    navigation.goBack();
  } catch (error) {
    Alert.alert("Error", "Ocurrió un error al actualizar la cita.");
    console.error("Error al actualizar la cita:", error);
  }
};

const deleteCita = () => {
  Alert.alert(
    "Confirmar",
    "¿Seguro que desea eliminar la cita?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await DeleteCita(cita.id);
            Alert.alert("Éxito", "La cita ha sido eliminada correctamente");
            console.log('cita eliminada', cita.id)
            navigation.goBack();
          } catch (error) {
            Alert.alert("Error", "Ocurrió un error al eliminar la cita");
            console.log(error);
          }
        },
      },
    ]
  );
};

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
            style={{ marginLeft: -5 }}
          />
          <Text style={styles.title}>Detalles</Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            contentStyle={styles.menuStyle}
            anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} color="#00635D" style={{marginRight: -5}}/>}
            >
              <Menu.Item
                onPress={deleteCita}
                title="Eliminar cita"
                leadingIcon={() => <MaterialCommunityIcons name="delete" size={25} color="#fff" />}
                titleStyle={styles.menuItemText}
                />
          </Menu>
        </View>

        {/* Información de la mascota */}
        <View style={styles.petInfo}>
          <Image
            source={{ uri: cita.fotoMascota }}
            style={styles.petImage}
          />
          <View style={styles.petDetails}>
            <Text style={styles.petName}>
              <Icon name="paw" size={30} color="#656464" /> {cita.nombreMascota}
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
            <Text style={styles.value}>{cita.motivoCita}</Text>
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
            <Text style={styles.value}>{cita.fecha.split("T")[0]}</Text>
          </View>

          <View style={styles.dateCard}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>{cita.hora}</Text>
          </View>
        </View>

        {/* Ubicación */}
        <Text style={styles.sectionTitle}>Ubicación</Text>
        <View style={styles.mapCard}>
          {latitud !== 0 && longitud !== 0 && (
            <MapView
              style={styles.map}
              region={{
                latitude: latitud,
                longitude: longitud,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: latitud, longitude: longitud }}
                title={cita.veterinaria}
              />
            </MapView>
          )}
        </View>

        <Text style={styles.label2}>Estatus</Text>
        <Menu
                visible={visibleStatus}
                onDismiss={() => setVisibleStatus(false)}
                anchor={
                  <Button
                  mode="outlined"
                  onPress={() => setVisibleStatus(true)}
                  contentStyle={styles.dropdownButton}
                  icon={() => <Icono name="arrow-drop-down" size={20} color="#656464" />}
                  labelStyle={styles.placeholderText}
                  style={styles.Button}
                  >
                    {selectedStatus || 'Selecciona el estatus'}
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

        {/* Notas adicionales */}
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
            onPress={handleUpdateCita}
            style={styles.button}
            labelStyle={{ color: '#00635D' }}
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
        width: 150,
        height: 150
    },
    menuStyle: {
      backgroundColor: '#333',
      borderRadius: 10,
      paddingVertical: 5,
      marginTop: 75,
  },
  menuItemText: {
      color: '#fff',
      fontSize: 16,
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
        color: '#000',
        fontWeight: 'bold'
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#818181',
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
        marginTop: 10,
        marginBottom: 10
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
});
