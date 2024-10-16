import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const trofeosData = [
    { titulo: "5 citas al hilo", fecha: "Enero", icono: "medal-outline" as const, color: "#D9D9D9" },
    { titulo: "Por algo se empieza", fecha: "Febrero", icono: "medal" as const, color: "#F4D184" },
    { titulo: "Las primeras son las más importantes", fecha: "Enero", icono: "trophy-outline" as const, color: "#2B63A6" },
    { titulo: "Vida saludable", fecha: "Enero", icono: "medal" as const, color: "rgba(215,162,251,100)" },
];

export const TrofeosScreen = () => {
    return (
        <>
        <Text style={styles.cardTitle}>Zona de trofeos <MaterialCommunityIcons name='trophy' size={20}/></Text>
        <Card style={styles.card}>
            <Card.Content>
                {trofeosData.map((trofeo, index) => (
                    <List.Item
                        key={index}
                        title={trofeo.titulo}
                        description={trofeo.fecha}
                        left={() => (
                            <View style={[styles.iconBackground, { backgroundColor: trofeo.color }]}>
                                <MaterialCommunityIcons 
                                    name={trofeo.icono} 
                                    size={30} 
                                    color="#C18832" 
                                />
                            </View>
                        )}
                        style={styles.listItem}
                    />
                ))}
            </Card.Content>
        </Card>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        width: '95%',
        elevation: 3,
        backgroundColor: '#fff',
        marginTop: 15,
        marginBottom: 10
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#656464',
        marginTop: 20
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ececec',
    },
    iconBackground: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
