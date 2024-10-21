import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from "../../routes/StackNavigator";

export const CardCategory = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const handleCategoryPress = (category: string) => {
        navigation.navigate('CategoryNewsScreen', { category });
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
                <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress('Gato')}>
                    <Text style={styles.textito}>Gato</Text>
                    <Image source={require("../../../assets/gato1.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress('Perro')}>
                    <Text style={styles.textito}>Perro</Text>
                    <Image source={require("../../../assets/perro.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress('Pájaro')}>
                    <Text style={styles.textito}>Pájaro</Text>
                    <Image source={require("../../../assets/pajaro.png")} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.category} onPress={() => handleCategoryPress('Pez')}>
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
