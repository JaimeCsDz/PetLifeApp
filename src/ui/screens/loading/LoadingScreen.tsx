import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';

export const LoadingScreen = ({ onFinish }: any) => {  
    const [progress, setProgress] = useState(0);
    const [fact, setFact] = useState('Cargando dato curioso...');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 1) {
                    return 0;
                }
                return prevProgress + 0.1;
            });
        }, 190);

        const getRandomFact = async () => {
            try {
                const isCatFact = Math.random() > 0.5;

                if (isCatFact) {
                    const response = await fetch('https://meowfacts.herokuapp.com/?lang=esp');
                    const data = await response.json();
                    setFact(data.data[0]);
                } else {
                    const response = await fetch('http://dog-api.kinduff.com/api/facts');
                    const data = await response.json();
                    const translatedFact = await translateToSpanish(data.facts[0]);
                    setFact(translatedFact);
                }

            } catch (error) {
                console.error('Error fetching fact:', error);
                setFact('No se pudo cargar un dato curioso.');
            }
        };

        getRandomFact();
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (fact !== 'Cargando dato curioso...') {
            const readingSpeedWPM = 150;
            const wordCount = fact.split(' ').length;
            const readingTime = (wordCount / readingSpeedWPM) * 60 * 1000;
            
            const minimumDisplayTime = 7000;

            const displayTime = Math.max(readingTime, minimumDisplayTime);

            setTimeout(() => {
                if (onFinish) {
                    onFinish();
                }
            }, displayTime);
        }
    }, [fact]);

    const translateToSpanish = async (text: string) => {
        try {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURI(text)}`
            );
            const result = await response.json();
            return result[0][0][0];
        } catch (error) {
            console.error('Error translating fact:', error);
            return 'No se pudo traducir el dato curioso.';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../../../assets/sabiasque.gif')} style={styles.image} />
            
            <Text style={styles.sabiasQue}>¿Sabías qué...?</Text>
            
            <Text style={styles.informacion}>
                {fact}
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', 
    },
    image: {
        width: 250,
        height: 250, 
        marginBottom: 20,
        resizeMode: 'contain',
    },
    sabiasQue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    informacion: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    loader: {
        marginTop: 20, 
    }
});
