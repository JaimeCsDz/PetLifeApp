import { ImageBackground, View, StyleSheet, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-paper"
import { Icon } from 'react-native-paper'
import { SvgXml } from "react-native-svg";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../routes/StackNavigator";


interface Props extends StackScreenProps<RootStackParams, "InicioScreen"> { }

export const InicioScreen = ({navigation}: Props) => {

    const onSignIn = () => navigation.navigate("SignInScreen")
    const onSignUp = () => navigation.navigate("SignUpScreen")

    return (
        <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require('../../../assets/backgroundInicio.png')}
            resizeMode="cover"
            style={styles.image}
        >
            <View style={styles.overlay} />
            <View style={styles.content}>
                <View style={styles.topContent}>
                <Image source={require('../../../assets/Icono.png')} style={styles.logo}></Image>
                <Text style={styles.title}>PetLife <Icon source='paw' size={40} color='#905010' /></Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onSignIn}><Button mode="contained" style={styles.button}>Iniciar sesión</Button></TouchableOpacity>
                    <TouchableOpacity onPress={onSignUp}><Button mode="outlined" style={[styles.button, styles.outlinedButton]} textColor="#00635D">Registrarse</Button></TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    topContent: {
        alignItems: 'center',
        marginTop: 80
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        opacity: 0.5,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50
    },
    logo: {
        marginTop: -50,
        alignSelf: 'center',
        width: 400,
        height: 400
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        marginTop: 15,
        width: 270,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#004E49',
    },
    outlinedButton: {
        borderColor: '#004E49',
        backgroundColor: 'transparent',
        
    },
    buttonContainer: {
        alignItems: 'center',
        width: '100%',
        paddingBottom: 30
    },
});
