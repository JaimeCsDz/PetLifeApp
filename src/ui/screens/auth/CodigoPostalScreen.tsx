import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../routes/StackNavigator';
import { Picker } from '@react-native-picker/picker';
import { getGeneros } from '../../../actions/genero/genero';
import { authRegister } from '../../../actions/auth/register';
import { IGeneroDto, IPersonaAPI } from '../../../interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';


interface Props extends StackScreenProps<RootStackParams, 'CodigoPostal'> {}

export const CodigoPostal = ({ navigation }: Props) => {
  const [generos, setGeneros] = useState<IGeneroDto[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [PasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);
  const [postalCode, setPostalCode] = useState<string>('');
  const [postalCodeError, setPostalCodeError] = useState<boolean>(false);
  const [isPostalCodeTouched, setIsPostalCodeTouched] = useState<boolean>(false);
  const [genderError, setGenderError] = useState<boolean>(false);
  const [isGenderTouched, setIsGenderTouched] = useState<boolean>(false);
  const [hidePass, setHidePass] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGeneros();
        if (response.length > 0) {
          setGeneros(response);
        } else {
          Alert.alert('Error', 'No se encontraron géneros.');
        }
      } catch (error) {
        Alert.alert('Error', 'Ocurrió un error al cargar los datos.');
      }
    };

    fetchData();
  }, []);

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  };
  

  const handleRegister = async () => {
    if (!email || !password || !postalCode || !selectedGender) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const storedData = await AsyncStorage.getItem('@userData');
      const userData = storedData ? JSON.parse(storedData) : {};

      const finalData: IPersonaAPI = {
        ...userData,
        correo: email,
        contraseña: password,
        codigoPostal: postalCode,
        idGenero: selectedGender,
      };

      const response = await authRegister(finalData);

      if (response.isSuccess && response.data?.token) {
        const { token } = response.data;

        await AsyncStorage.setItem('userToken', token);

        const decoded = decodeJWT(token);
        if (decoded) {
          const { nombre, apPaterno, apMaterno } = decoded;
          await AsyncStorage.setItem('@userData', JSON.stringify({ nombre, apPaterno, apMaterno }));

          navigation.navigate('HomeScreen');
        }
      } else {
        Alert.alert('Error', response.message || 'Ocurrió un error durante el registro');
      }
    } catch (error) {
      console.error('Error en la solicitud de registro:', error);
      Alert.alert('Error', 'Ocurrió un error durante el registro.');
    } finally {
      setIsLoading(false);
    }
  };


  const isFormValid = email && password && postalCode && selectedGender && !emailError && !PasswordError && !postalCodeError;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Completa tu Registro</Text>

            <TextInput
              label="Correo"
              mode="outlined"
              outlineColor="#C4C4C4"
              activeOutlineColor="#037972"
              placeholder="Ex. abc@example.com"
              placeholderTextColor="#C4C4C4"
              left={<TextInput.Icon icon="email" color="#C4C4C4" />}
              style={styles.input}
              value={email}
              onBlur={() => setIsEmailTouched(true)}
              onChangeText={setEmail}
              error={emailError && isEmailTouched}
            />
            {emailError && isEmailTouched && (
              <HelperText type="error">El correo electrónico no tiene un formato válido.</HelperText>
            )}

            <TextInput
              label="Contraseña"
              mode="outlined"
              textColor='#C4C4C4'
              secureTextEntry={hidePass}
              outlineColor="#C4C4C4"
              activeOutlineColor="#037972"
              placeholder="********"
              placeholderTextColor="#C4C4C4"
              left={<TextInput.Icon icon="lock" color={'#C4C4C4'}/>}
              right={
                <TextInput.Icon
                  icon={hidePass ? 'eye-outline' : 'eye-off-outline'}
                  onPress={() => setHidePass(!hidePass)}
                  color={'#C4C4C4'}
                />
              }
              style={styles.input}
              value={password}
              onBlur={() => setIsPasswordTouched(true)}
              onChangeText={setPassword}
              error={PasswordError && isPasswordTouched}
            />
            {PasswordError && isPasswordTouched && (
              <HelperText type="error">
                1. La contraseña no es válida.
                {'\n'}2. Longitud mínima: al menos 8 caracteres.
                {'\n'}3. Al menos una letra mayúscula.
                {'\n'}4. Al menos una letra minúscula.
                {'\n'}5. Al menos un número.
                {'\n'}6. Al menos un carácter especial (@, #, !, etc.).
              </HelperText>
            )}

            <TextInput
              label="Código Postal"
              mode="outlined"
              outlineColor="#C4C4C4"
              activeOutlineColor="#037972"
              placeholder="Ex. 77536"
              placeholderTextColor="#C4C4C4"
              left={<TextInput.Icon icon="map-marker" color="#C4C4C4" />}
              style={styles.input}
              value={postalCode}
              onBlur={() => setIsPostalCodeTouched(true)}
              onChangeText={setPostalCode}
              error={postalCodeError && isPostalCodeTouched}
            />
            {postalCodeError && isPostalCodeTouched && (
              <HelperText type="error">El Código Postal no es válido.</HelperText>
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGender}
                onValueChange={(itemValue) => setSelectedGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona tu género" value="" />
                {generos.map((genero) => (
                  <Picker.Item key={genero.idGenero} label={genero.generos} value={genero.idGenero.toString()} />
                ))}
              </Picker>
              {genderError && isGenderTouched && (
                <HelperText type="error">Por favor selecciona un género.</HelperText>
              )}
            </View>

            <Button
              mode="outlined"
              onPress={handleRegister}
              textColor="#00635D"
              disabled={!isFormValid}
              style={styles.registerButton}
            >
              Registrarse
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
            </TouchableOpacity>
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
    backgroundColor: '#FFF' 
  },
  keyboardAvoidingContainer: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 40 
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    alignItems: 'center',
    position: 'relative',
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
    color: '#000' 
  },
  input: { 

    marginBottom: 15, 
    width: '100%', 
    backgroundColor: '#fff' 
  },
  registerButton: { 
    paddingVertical: 4, 
    borderRadius: 30, 
    width: '100%', 
    marginTop: 20, 
    borderColor: '#00635D'
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#037972', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  loginText: { 
    marginTop: 20, 
    color: '#2F76E1', 
    textDecorationLine: 'underline' 
  },
  bottomImage: {
    position: "absolute",
    bottom: -135,
    right: -40,
    width: 220,
    height: 220,
    zIndex: -999999999
  },
});

export default CodigoPostal;
