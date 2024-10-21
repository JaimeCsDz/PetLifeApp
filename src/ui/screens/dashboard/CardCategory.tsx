import React from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text } from 'react-native-paper';

export const CardCategory = ({ onCategoryPress }: { onCategoryPress: (category: string) => void }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.category} onPress={() => onCategoryPress('Gato')}>
                    <Text style={styles.textito}>Gato</Text>
                    <Image source={require("../../../assets/gato1.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.category} onPress={() => onCategoryPress('Perro')}>
                    <Text style={styles.textito}>Perro</Text>
                    <Image source={require("../../../assets/perro.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.category} onPress={() => onCategoryPress('Pájaro')}>
                    <Text style={styles.textito}>Pájaro</Text>
                    <Image source={require("../../../assets/pajaro.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.category} onPress={() => onCategoryPress('Pez')}>
                    <Text style={styles.textito}>Pez</Text>
                    <Image source={require("../../../assets/pez.png")} style={styles.image} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    categoryContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingTop: 20,
        height: 150,
    },
    category: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ABB7C2",
        borderRadius: 15,
        padding: 15,
        width: 100,
        height: 120,
    },
    image: {
        width: 100,
        height: 80,
    },
    textito: {
        fontWeight: "bold",
        color: "#7d7d7d",
        margin: 0
    },
});
