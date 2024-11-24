import React from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export const CardInformation = ({ articles, isLoading }: { articles: any[], isLoading: boolean }) => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>Cargando noticias...</Text>
            ) : (
                articles.slice(0, 5).map((item, index) => (
                    <Card style={styles.card} key={index}>
                        <View style={styles.content}>
                            <View style={styles.leftContent}>
                                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                                    {item.titulo}
                                </Text>
                                <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                                    {item.descripcion}
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        mode="text"
                                        textColor="#4E7AD8"
                                        compact={true}
                                        onPress={() => Linking.openURL(item.urlSitio)}
                                        labelStyle={{ textDecorationLine: 'underline' }}
                                    >
                                        Ver más
                                    </Button>
                                </View>
                            </View>
                            <Image source={{ uri: item.urlImagen || 'https://via.placeholder.com/100' }} style={styles.image} />
                        </View>
                    </Card>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 80,
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#7A7A7A',
        marginBottom: 5,
    },
    buttonContainer: {
        alignItems: 'flex-start',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 60,
    },
});
