import React from "react";
import { SafeAreaView, View, Image, StyleSheet } from "react-native";
import { Button, Text } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../routes/StackNavigator';
import { StackScreenProps } from "@react-navigation/stack";


export const Citas = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image
                    source={require("../../../assets/dog-gum.png")}
                    style={styles.image}
                />
                <Text style={styles.text}>Parece que no tienes citas disponibles</Text>
                <Button
                    mode="contained"
                    style={styles.button}
                    // onPress={() => navigation.navigate("FormCitasScreen")}
                >
                    Agregar cita
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 120,
        width: 120,
        marginBottom: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'semibold',
        fontSize: 14,
        color: '#656464',
    },
    button: {
        textAlign: 'center',
        borderRadius: 12,
        height: 45,
        backgroundColor: '#00635D',
        marginTop: 20
    }
});
