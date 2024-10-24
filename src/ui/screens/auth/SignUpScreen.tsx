import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParams } from '../../routes/StackNavigator';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props extends StackScreenProps<RootStackParams, 'SignUpScreen'> {}

export const SignUpScreen = ({ navigation }: Props) => {
  const [name, setName] = useState<string>('');
  const [surnameP, setsurnameP] = useState<string>('');
  const [surnameM, setsurnameM] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [surnamePError, setsurnamePError] = useState<boolean>(false);
  const [surnameMError, setsurnameMError] = useState<boolean>(false);
  const [isNameTouched, setIsNameTouched] = useState<boolean>(false);
  const [issurnamePTouched, setIssurnamePTouched] = useState<boolean>(false);
  const [issurnameMTouched, setIssurnameMTouched] = useState<boolean>(false);

  const validateName = (name: string) => {
    const NameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    return NameRegex.test(name);
  };

  const onChangeName = (name: string) => {
    setName(name);
    if (isNameTouched) {
      setNameError(!validateName(name));
    }
  };

  const onChangesurnameP = (surnameP: string) => {
    setsurnameP(surnameP);
    if (issurnamePTouched) {
      setsurnamePError(!validateName(surnameP));
    }
  };

  const onChangesurnameM = (surnameM: string) => {
    setsurnameM(surnameM);
    if (issurnameMTouched) {
      setsurnameMError(!validateName(surnameM));
    }
  };

  const handleName = () => {
    setIsNameTouched(true);
    setNameError(!validateName(name));
  };

  const handlesurnameP = () => {
    setIssurnamePTouched(true);
    setsurnamePError(!validateName(surnameP));
  };

  const handlesurnameM = () => {
    setIssurnameMTouched(true);
    setsurnameMError(!validateName(surnameM));
  };

  const isFormValid = name && surnameP && surnameM && !nameError && !surnamePError && !surnameMError;

  const onNextStep = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
      return;
    }

    // Guardar datos en AsyncStorage
    try {
      const userData = {nombre: name, apPaterno: surnameP, apMaterno: surnameM}
      await AsyncStorage.setItem('@userData', JSON.stringify(userData));
      navigation.navigate('CodigoPostal');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar los datos.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Image source={require('../../../assets/SignUp.png')} style={styles.floatingImage} />
            <Text style={styles.title}>
              <Text style={styles.titleLine1}>Crea una</Text>{'\n'}
              <Text style={styles.titleLine2}>cuenta</Text>
            </Text>

            <TextInput
              label="Nombre"
              mode="outlined"
              outlineColor="#C4C4C4"
              activeOutlineColor="#037972"
              placeholder="Ex. Saul Ramirez"
              placeholderTextColor={'#C4C4C4'}
              left={<TextInput.Icon icon="account" color={'#C4C4C4'} />}
              style={styles.input}
              value={name}
              onBlur={handleName}
              onChangeText={onChangeName}
              error={nameError && isNameTouched}
            />

            {nameError && isNameTouched ? (
              <HelperText type="error">El Nombre no es válido.</HelperText>
            ) : null}

            <TextInput
              label="Apellido paterno"
              mode="outlined"
              outlineColor="#C4C4C4"
              activeOutlineColor="#037972"
              placeholder="Ex. Lopez"
              placeholderTextColor={'#C4C4C4'}
              left={<TextInput.Icon icon="account-tie" color={'#C4C4C4'} />}
              style={styles.input}
              value={surnameP}
              onBlur={handlesurnameP}
              onChangeText={onChangesurnameP}
              error={surnamePError && issurnamePTouched}
            />

            {surnamePError && issurnamePTouched ? (
              <HelperText type="error">El Apellido Paterno no es válido.</HelperText>
            ) : null}

            <TextInput
              label="Apellido materno"
              mode="outlined"
              outlineColor="#C4C4C4"
              activeOutlineColor="#037972"
              placeholder="Ex. Gomez"
              placeholderTextColor={'#C4C4C4'}
              left={<TextInput.Icon icon="account-star-outline" color={'#C4C4C4'} />}
              style={styles.input}
              value={surnameM}
              onBlur={handlesurnameM}
              onChangeText={onChangesurnameM}
              error={surnameMError && issurnameMTouched}
            />

            {surnameMError && issurnameMTouched ? (
              <HelperText type="error">El Apellido Materno no es válido.</HelperText>
            ) : null}

            <Button mode="outlined" style={styles.registerButton} textColor="#00635D" onPress={onNextStep} disabled={!isFormValid}>
              Siguiente
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
            </TouchableOpacity>
              <Image
              source={require("../../../assets/gato.png")}
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#037972",
    marginBottom: 20,
    textAlign: 'center'
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
    backgroundColor: '#fff',
    color: '#a2a2a2',
  },
  registerButton: {
    borderColor: "#00635D",
    paddingVertical: 4,
    borderRadius: 30,
    width: "100%",
    marginTop: 20
  },
  loginText: {
    marginTop: 20,
    color: "#2F76E1",
    textDecorationLine: "underline",
  },
  floatingImage: {
    position: "absolute",
    top: -90,
    left: -50,
    width: 190,
    height: 190,
    transform: [{scaleX: -1}]
  },
  bottomImage: {
    position: "absolute",
    bottom: -125,
    right: -50,
    width: 190,
    height: 190,
    zIndex: -999999999
  },
});
