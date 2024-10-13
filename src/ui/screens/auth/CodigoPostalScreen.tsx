import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button } from "react-native-paper";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../routes/StackNavigator";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";

interface Props extends StackScreenProps<RootStackParams, "CodigoPostal"> {}

export const CodigoPostal = ({ navigation }: Props) => {

    const [selectedGender, setSelectedGender] = useState<string>('');

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingContainer}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Ya casí lo tienes</Text>

                <TextInput
                label="Correo"
                mode="outlined"
                outlineColor="#C4C4C4"
                activeOutlineColor="#037972"
                placeholder="Ex. abc@gmail.com"
                placeholderTextColor={"#C4C4C4"}
                left={<TextInput.Icon icon="at" color={"#C4C4C4"} />}
                style={styles.input}
                />

                <TextInput
                label="Contraseña"
                mode="outlined"
                outlineColor="#C4C4C4"
                activeOutlineColor="#037972"
                placeholder="Ex. ********"
                placeholderTextColor={"#C4C4C4"}
                left={<TextInput.Icon icon="lock" color={"#C4C4C4"} />}
                style={styles.input}
                />

                <TextInput
                label="Codigo Postal"
                mode="outlined"
                outlineColor="#C4C4C4"
                activeOutlineColor="#037972"
                placeholder="Ex. 77536"
                placeholderTextColor={"#C4C4C4"}
                left={<TextInput.Icon icon="map-marker" color={"#C4C4C4"} />}
                style={styles.input}
                />

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedGender}
                    onValueChange={(itemValue) => setSelectedGender(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecciona tú género" value="" />
                    <Picker.Item label="Masculino" value="masculino" />
                    <Picker.Item label="Femenino" value="femenino" />
                    <Picker.Item label="Otro" value="otro" />
                </Picker>
            </View>

                <Button
                mode="outlined"
                style={styles.registerButton}
                textColor="#00635D"
                onPress={()=>navigation.navigate('HomeScreen')}
                >
                Registrarse
                </Button>

                <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
                </TouchableOpacity>

                {/* Imagen flotante montada en la esquina inferior derecha */}
                <Image
                source={require("../../../assets/cp.png")}
                style={styles.bottomImage}
                />
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    formContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 5,
        width: "85%",
        alignItems: "center",
        position: "relative",
    },
    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    picker: {
        height: 50,
        color: '#000',
        paddingLeft: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#037972",
        marginBottom: 20,
        textAlign: "center",
    },
    titleLine1: {
        fontSize: 35,
        fontWeight: "bold",
        color: "#037972",
    },
    titleLine2: {
        fontSize: 35,
        fontWeight: "bold",
        color: "#037972",
    },
    input: {
        marginBottom: 15,
        width: "100%",
        backgroundColor: "#fff",
        color: "#a2a2a2",
    },
    registerButton: {
        borderColor: "#00635D",
        paddingVertical: 4,
        borderRadius: 30,
        width: "100%",
        marginTop: 20,
    },
    loginText: {
        marginTop: 20,
        color: "#2F76E1",
        textDecorationLine: "underline",
    },
    
    bottomImage: {
        position: "absolute",
        bottom: -170,
        right: -45,
        width: 250,
        height: 250,
        zIndex: -9999999999
    },
});
