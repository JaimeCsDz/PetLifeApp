import React from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text } from 'react-native-paper';

export const CardCategory = ({ onCategoryPress, selectedCategory, }: { onCategoryPress: (categoryId: string) => void, selectedCategory: string;}) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
                <TouchableOpacity style={[
                        styles.category, 
                        selectedCategory === 'b33665f5-d8b1-40eb-be3a-4d45144ad0b3' && styles.selectedCategory
                    ]} 
                    onPress={() => onCategoryPress('b33665f5-d8b1-40eb-be3a-4d45144ad0b3')}>
                    <Text style={styles.textito}>Gato</Text>
                    <Image source={require("../../../assets/gato1.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={[
                        styles.category, 
                        selectedCategory === 'bd1ee1de-3414-472c-9ccb-078d20fec4a2' && styles.selectedCategory
                    ]}
                    onPress={() => onCategoryPress('bd1ee1de-3414-472c-9ccb-078d20fec4a2')}>
                    <Text style={styles.textito}>Perro</Text>
                    <Image source={require("../../../assets/perro.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={[
                        styles.category, 
                        selectedCategory === 'eae9ecd9-b31e-4345-8ef5-ef7e802e5b3c' && styles.selectedCategory
                    ]}
                    onPress={() => onCategoryPress('eae9ecd9-b31e-4345-8ef5-ef7e802e5b3c')}>
                    <Text style={styles.textito}>Pájaro</Text>
                    <Image source={require("../../../assets/pajaro.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={[
                        styles.category, 
                        selectedCategory === 'e345e14f-556e-4f53-bccb-043e0808d2f9' && styles.selectedCategory
                    ]}
                    onPress={() => onCategoryPress('e345e14f-556e-4f53-bccb-043e0808d2f9')}>
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
    selectedCategory: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E9',
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
