import React from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

export const data = [
    {
        id: 1,
        title: 'Protección animal',
        description: 'Organización de protección de animales en Cancún',
        label: 'Gobierno',
        image: require('../../../assets/descarga1.jpg'),
        telefono: 9984815254,
        url: 'https://www.facebook.com/DireccionProteccionBienestarAnimal/?locale=es_LA'
    },
    {
        id: 2,
        title: 'PETA',
        description: 'Es la organización de derechos animales más grande del mundo, con más de 6.5 millones de miembros y simpatizantes. ',
        label: 'Mundial',
        image: require('../../../assets/descarga.png'),
        telefono: 9984815254,
        url: 'https://www.facebook.com/DireccionProteccionBienestarAnimal/?locale=es_LA'

    },
    {
        id: 3,
        title: 'PROFEPA',
        description: 'Agencia gubernamental encargada de la protección del medio ambiente y la fauna silvestre en México.',
        label: 'Gobierno',
        image: require('../../../assets/images.png'),
        telefono: 9984815254,
        url: 'https://www.facebook.com/DireccionProteccionBienestarAnimal/?locale=es_LA'
    },
    {
        id: 4,
        title: 'Dejando Huella por Cancún A.C',
        description: 'Asociación civil que se encarga del rescate y adopción de perros y gatos en Cancún.',
        label: 'Asociación',
        image: require('../../../assets/Logo-Fundacion-Dejando-Huellas-por-Cancun-A.C.webp'),
        telefono: '99888701062',
        url: 'https://dejandohuellascancun.org/'
    },
    {
        id: 5,
        title: 'Fundación Huellitas Aleman',
        description: 'Persona independiente que se encarga del rescate, rehabilitación y adopción de perros en Cancún.',
        label: 'Asociación',
        image: require('../../../assets/orlandoaleman-1080x630.jpeg'),
        telefono: '99888701062',
        url: 'https://www.instagram.com/fundacionhuellitasaleman/?hl=es'
    },
    {
        id: 6,
        title: 'Tierra de animales',
        description: 'Alberga cerca de 500 animales de distintas especies, en su gran mayoría perros y perras rescatados del abandono en las calles',
        label: 'Asociación',
        image: require('../../../assets/logo-tierra.png'),
        telefono: '99888701062',
        url: 'https://www.instagram.com/tierradeanimales/?hl=es'
    },
];

interface CardResourceProps {
    data: {
        id: number;
        title: string;
        description: string;
        label: string;
        image: any;
        telefono: string | number;
        url: string;
    }[];
}

export const CardResource: React.FC<CardResourceProps> = ({ data }) => {
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
                    <Button mode="contained" textColor="#fff" style={{borderRadius: 10, width: '25%'}} buttonColor='#037972' compact={true} onPress={() => Linking.openURL(item.url)} >
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
        width: 85,
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
        marginRight: -80,
        alignItems: 'flex-end',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 45
    },
});
