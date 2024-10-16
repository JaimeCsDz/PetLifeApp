import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

const data = [
    {
        id: 1,
        title: 'Cuida a tu mascota',
        description: 'Todo lo que debes saber para mantener sana y segura a tu mascota.',
        label: 'Label',
        image: require('../../../assets/perro.png'),
    },
    {
        id: 2,
        title: 'Cuida a tu mascota',
        description: 'Todo lo que debes saber para mantener sana y segura a tu mascota.',
        label: 'Label',
        image: require('../../../assets/perro.png'),
    },
    {
        id: 3,
        title: 'Cuida a tu mascota',
        description: 'Todo lo que debes saber para mantener sana y segura a tu mascota.',
        label: 'Label',
        image: require('../../../assets/perro.png'),
    },
    {
        id: 4,
        title: 'Cuida a tu mascota',
        description: 'Todo lo que debes saber para mantener sana y segura a tu mascota.',
        label: 'Label',
        image: require('../../../assets/perro.png'),
    },
];

export const CardInformation = () => {
    return (
        <View style={styles.container}>
        {data.map((item) => (
            <Card style={styles.card} key={item.id}>
            <View style={styles.content}>
                {/* Parte izquierda (label + texto) */}
                <View style={styles.leftContent}>
                <View style={styles.label}>
                    <View style={styles.labelIcon} />
                    <Text style={styles.labelText}>{item.label}</Text>
                </View>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                    {item.description}
                </Text>
                <View style={styles.buttonContainer}>
                    <Button mode="text" textColor="#4E7AD8" compact={true} onPress={() => {}} labelStyle={{textDecorationLine: 'underline'}}>
                    Ver más
                    </Button>
                </View>
                </View>

                <Image source={item.image} style={styles.image} />
            </View>
            </Card>
        ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 20,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: '95%',
        height: 170,
        backgroundColor: '#ffffff',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },
    leftContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    labelIcon: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'green',
        marginRight: 5,
    },
    labelText: {
        backgroundColor: '#00635D',
        color: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 15,
        fontSize: 12,
        height: 30,
        width: 55,
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        flexShrink: 1,
    },
    description: {
        fontSize: 14,
        color: '#7A7A7A',
        marginBottom: 5,
        flexShrink: 1,
    },
    buttonContainer: {
        alignItems: 'flex-start',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 40,
    },
});
