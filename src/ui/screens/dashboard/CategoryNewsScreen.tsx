import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { fetchNoticiasMascotas, IArticle } from '../../../actions/dashboard/dashboard';
import { useRoute } from '@react-navigation/native';

export const CategoryNewsScreen = () => {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const route = useRoute();
    const { category } = route.params as { category: string };

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            const response = await fetchNoticiasMascotas(1, category);
            if (response.isSuccess) {
                setArticles(response.data || []);
            }
            setIsLoading(false);
        };

        fetchArticles();
    }, [category]);

    const handlePress = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {isLoading ? (
                <Text>Cargando noticias...</Text>
            ) : (
                articles.slice(0, 10).map((item, index) => (
                    <Card style={styles.card} key={index}>
                        <View style={styles.content}>
                            <View style={styles.leftContent}>
                                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                                    {item.title}
                                </Text>
                                <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                                    {item.description}
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        mode="text"
                                        textColor="#4E7AD8"
                                        compact={true}
                                        onPress={() => handlePress(item.url)}
                                        labelStyle={{ textDecorationLine: 'underline' }}
                                    >
                                        Ver más
                                    </Button>
                                </View>
                            </View>
                            <Image source={{ uri: item.urlToImage || 'https://via.placeholder.com/100' }} style={styles.image} />
                        </View>
                    </Card>
                ))
            )}
        </ScrollView>
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
        borderRadius: 40,
    },
});
