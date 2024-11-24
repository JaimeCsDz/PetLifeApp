import * as React from 'react';
import * as Location from 'expo-location';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, Alert } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { MAPS_KEY } from '@env';
import MapViewDirections from 'react-native-maps-directions';
import { ICoordenadas } from '../../../interfaces/Coordenadas';
import { ISuggestion } from '../../../interfaces/Suggestion';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
export const MapsScreen = () => {
    const [origin, setOrigin] = React.useState<ICoordenadas | null>(null);
    const [destination, setDestination] = React.useState<ICoordenadas | null>(null);
    const [places, setPlaces] = React.useState<ICoordenadas[]>([]);
    const [suggestions, setSuggestions] = React.useState<ISuggestion[]>([]);
    const [searchText, setSearchText] = React.useState('');
    const mapRef = React.useRef<MapView | null>(null);

    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permiso necesario',
                    'La aplicación necesita acceso a tu ubicación para funcionar correctamente.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Intentar de nuevo', onPress: () => getLocation() },
                    ]
                );
                return;
            }

            const isLocationEnabled = await Location.hasServicesEnabledAsync();
            if (!isLocationEnabled) {
                Alert.alert(
                    'Servicios de ubicación desactivados',
                    'Por favor, activa los servicios de ubicación en tu dispositivo.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Abrir configuración', onPress: () => Location.enableNetworkProviderAsync() },
                    ]
                );
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error('Error obteniendo la ubicación:', error);
            Alert.alert(
                'Error',
                'No se pudo obtener la ubicación. Por favor, verifica los permisos y servicios de ubicación.'
            );
        }
    };

    // Usa `useFocusEffect` para verificar permisos cada vez que el tab esté activo
    useFocusEffect(
        useCallback(() => {
            getLocation();
        }, [])
    );
        

    const getAutocompleteSuggestions = async (input: string) => {
        if (input.length > 2) { 
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${MAPS_KEY}&location=${origin?.latitude},${origin?.longitude}&radius=2000`;
            try {
                const response = await axios.get(url);
                setSuggestions(response.data.predictions);
            } catch (error) {
                console.error("Error buscando sugerencias: ", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const getPlaceDetails = async (placeId: string) => {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MAPS_KEY}`;
        try {
            const response = await axios.get(url);
            const place = response.data.result;
            const location = place.geometry.location;
            setDestination({
                latitude: location.lat,
                longitude: location.lng,
            });
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.09,
                }, 1000);
            }
            setPlaces([]);
            setSuggestions([]);
        } catch (error) {
            console.error("Error obteniendo detalles del lugar: ", error);
        }
    };

    const searchNearbyPlaces = async (type: string) => {
        if (origin) {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.latitude},${origin.longitude}&radius=2000&type=${type}&key=${MAPS_KEY}`;
            try {
                const response = await axios.get(url);
                const results = response.data.results;
                const nearbyPlaces = results.map((place: any) => ({
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                }));
                setPlaces(nearbyPlaces);
                setDestination(null);
                setSuggestions([]);
            } catch (error) {
                console.error("Error buscando lugares: ", error);
            }
        }
    };

    const handleSearch = () => {
        if (searchText.toLowerCase().includes('veterinaria')) {
            searchNearbyPlaces('veterinary_care');
        } else if (searchText.toLowerCase().includes('parque')) {
            searchNearbyPlaces('park');
        } else {
            getAutocompleteSuggestions(searchText);
        }
        setSuggestions([]);
        Keyboard.dismiss();
    };

    const handlePlaceSelect = (place: ICoordenadas) => {
        setDestination(place);
        setPlaces([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Barra de búsqueda sobre el mapa */}
            <View style={styles.searchBar}>
                <Ionicons name="search" size={24} color="gray" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar lugares..."
                    value={searchText}
                    onChangeText={(text) => {
                        setSearchText(text);
                        getAutocompleteSuggestions(text);
                    }}
                    onSubmitEditing={handleSearch}
                />
            </View>

            {/* Lista de sugerencias */}
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.suggestionItem}
                            onPress={() => getPlaceDetails(item.place_id)}
                        >
                            <Text>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                />
            )}

            {/* Mapa */}
            <MapView
                ref={mapRef}
                initialRegion={{
                    latitude: origin?.latitude || 21.13713, 
                    longitude: origin?.longitude || -86.88750,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.09,
                }}
                style={styles.map}
                onPress={() => setDestination(null)}
            >
                {/* Marcador de la ubicación del usuario */}
                {origin && (
                    <Marker
                        draggable={true}
                        coordinate={origin}
                        title="Tu ubicación"
                        onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
                    />
                )}

                {/* Marcadores de los lugares cercanos */}
                {places.map((place, index) => (
                    <Marker
                        key={index}
                        coordinate={place}
                        title="Lugar cercano"
                        onPress={() => handlePlaceSelect(place)}
                    />
                ))}

                {/* Marcador del destino seleccionado */}
                {destination && (
                    <>
                        <Marker
                            coordinate={destination}
                            title="Lugar seleccionado"
                        />
                        <MapViewDirections
                            origin={origin!}
                            destination={destination}
                            apikey={MAPS_KEY}
                            strokeColor="black"
                            strokeWidth={4}
                        />
                    </>
                )}
            </MapView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        position: 'absolute',
        top: 40,
        left: 10,
        right: 10,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
    },
    suggestionsList: {
        position: 'absolute',
        top: 90,
        left: 10,
        right: 10,
        zIndex: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
    },
    suggestionItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    map: {
        flex: 1,
    },
});
