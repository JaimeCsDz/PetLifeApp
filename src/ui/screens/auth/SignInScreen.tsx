import { StackScreenProps } from "@react-navigation/stack";
import { ScrollView } from "react-native-gesture-handler";
import { RootStackParams } from "../../routes/StackNavigator";
import { Text, TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Icon } from 'react-native-paper';
import { useState } from "react";

interface Props extends StackScreenProps<RootStackParams, "SignInScreen"> { }

export const SignInScreen = ({ navigation }: Props) => {
    const [hidePass, setHidePass] = useState<boolean>(true);
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Imagen del perro */}
                    <View style={styles.header}>
                        <Image source={require('../../../assets/Login.png')} style={styles.image}></Image>
                    </View>

                    {/* Formulario de inicio de sesión */}
                    <View style={styles.formContainer}>
                        <Text style={styles.welcomeText}>Bienvenido <Icon source='paw' size={40} color='#905010' /></Text>

                        <TextInput
                            label="Correo electrónico"
                            mode="outlined"
                            outlineColor="#C4C4C4"
                            activeOutlineColor="#C4C4C4"
                            placeholder="Ex: abc@example.com"
                            placeholderTextColor={"#C4C4C4"}
                            left={<TextInput.Icon icon="email"/>}
                            style={styles.input}
                        />

                        <TextInput
                            label="Contraseña"
                            mode="outlined"
                            secureTextEntry={hidePass}
                            placeholder="********"
                            placeholderTextColor={"#C4C4C4"}
                            outlineColor="#C4C4C4"
                            activeOutlineColor="#C4C4C4"
                            left={<TextInput.Icon icon="lock" />}
                            style={styles.input}
                            textColor="#C4C4C4"
                            right={
                                    <TextInput.Icon
                                    icon={hidePass ? "eye-outline" : "eye-off-outline"}
                                    onPress={() => setHidePass(!hidePass)}
                                    />
                                }
                        />

                        <Button mode="contained" style={styles.loginButton}>
                            Iniciar sesión
                        </Button>

                        <TouchableOpacity>
                            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text>¿No tienes una cuenta? </Text>
                            <TouchableOpacity onPress={()=> navigation.navigate('SignUpScreen')}>
                                <Text style={styles.registerText}>Regístrate</Text>
                            </TouchableOpacity>
                        </View>
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
    header: {
        alignItems: "center",
        marginBottom: -40,
        zIndex: 1,
    },
    image: {
        width: 330,
        height: 330,
        zIndex: 1,
        marginTop: -165,
    },
    formContainer: {
        backgroundColor: "#FFFF",
        borderRadius: 30,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        width: '80%',
        zIndex: 0,
        alignItems: "center", 
    },
    welcomeText: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: "#037972",
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        color: "#C4C4C4",
        backgroundColor: "#FFFFFF",
        width: '100%',
    },
    forgotPasswordText: {
        color: "#2F76E1",
        marginTop: 20,
    },
    loginButton: {
        backgroundColor: "#004E49",
        paddingVertical: 5,
        borderRadius: 30,
        width: '100%',
        marginTop: 10
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: {
        color: "#2F76E1",
        fontWeight: "bold",
    },
});
