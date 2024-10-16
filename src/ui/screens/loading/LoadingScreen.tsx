import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 1) {
                    return 0;
                }
                return prevProgress + 0.1;
            });
        }, 190);

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../../../assets/sabiasque.gif')} style={styles.image} />
            
            <Text style={styles.sabiasQue}>¿Sabías qué...?</Text>
            
            <Text style={styles.informacion}>
                "Los gatos tienen 5 dedos en las patas delanteras y 4 en las traseras."
            </Text>
            <Progress.Bar progress={progress} width={200} color="#0000ff" style={styles.loader} />
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
