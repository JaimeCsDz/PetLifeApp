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
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../../routes/StackNavigator";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

interface Props extends StackScreenProps<RootStackParams, "CodigoPostal"> {}

export const CodigoPostal = ({ navigation }: Props) => {
  const [hidePass, setHidePass] = useState<boolean>(true);

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [PasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);
  const [postalCode, setPostalCode] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<boolean>(false);
  const [isPostalCodeTouched, setIsPostalCodeTouched] = useState<boolean>(false);
  const [genderError, setGenderError] = useState<boolean>(false);
  const [isGenderTouched, setIsGenderTouched] = useState<boolean>(false);

  // Función de validación de email :3
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChangeEmail = (email: string) => {
    setEmail(email);

    if (isEmailTouched) {
      setEmailError(!validateEmail(email));
    }
  };

  const handleEmail = () => {
    setIsEmailTouched(true);
    setEmailError(!validateEmail(email));
  };

  // Función de validación de pass :3
  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const onChangePassword = (password: string) => {
    setPassword(password);

    if (isPasswordTouched) {
      setPasswordError(!validatePassword(password));
    }
  };

  const handlePassword = () => {
    setIsPasswordTouched(true);
    setPasswordError(!validatePassword(password));
  };

  const validatePostalCode = (code: string) => {
    const PostalCodeRegex = /^\d{5}$/;
    return PostalCodeRegex.test(code);
  };

  const onChangePostalCode = (code: string) => {
    setPostalCode(code);
    if (isPostalCodeTouched) {
      setPostalCodeError(!validatePostalCode(code));
    }
  };

  const handlePostalCodeBlur = () => {
    setIsPostalCodeTouched(true);
    setPostalCodeError(!validatePostalCode(postalCode));
  };

  const handleGenderBlur = () => {
    setIsGenderTouched(true);
    setGenderError(selectedGender === '');
  };

  const isFormValid = password && email && postalCode && selectedGender && !PasswordError && !emailError && !postalCodeError && !genderError;


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
              value={email}
              onBlur={handleEmail}
              onChangeText={onChangeEmail}
              error={emailError && isEmailTouched}
            />

            {emailError && isEmailTouched ? (
              <HelperText type="error">
                El correo electrónico no tiene un formato válido.
              </HelperText>
            ) : null}

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

            {PasswordError && isPasswordTouched ? (
              <HelperText type="error">
              <Text>1. La contraseña no es válida.</Text>
              <Text>2. Longitud mínima: al menos 8 caracteres.</Text>
              <Text>3. Al menos una letra mayúscula.</Text>
              <Text>4. Al menos una letra minúscula.</Text>
              <Text>5. Al menos un número.</Text>
              <Text>6. Opcionalmente, al menos un carácter especial (como @, #, !, etc.).</Text>
            </HelperText>
            
            ) : null}

            <TextInput
              label="Codigo Postal"
              mode="outlined"
              outlineColor="#C4C4C4"
              activeOutlineColor="#037972"
              placeholder="Ex. 77536"
              placeholderTextColor={"#C4C4C4"}
              left={<TextInput.Icon icon="map-marker" color={"#C4C4C4"} />}
              style={styles.input}
              value={postalCode}
              onBlur={handlePostalCodeBlur}
              onChangeText={onChangePostalCode}
              error={postalCodeError && isPostalCodeTouched}
            />

            {postalCodeError && isPostalCodeTouched ? (
              <HelperText type="error">
                El Código Postal no es válido.
              </HelperText>
            ) : null}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGender}
                onValueChange={(itemValue) => {
                  setSelectedGender(itemValue);
                  if (isGenderTouched) {
                    setGenderError(itemValue === "");
                  }
                }}
                onBlur={handleGenderBlur}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona tú género" value="" />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Femenino" value="femenino" />
                <Picker.Item label="Otro" value="otro" />
              </Picker>

              {genderError && isGenderTouched ? (
                <HelperText type="error">
                  Por favor selecciona un género.
                </HelperText>
              ) : null}
            </View>

            <Button
              mode="outlined"
              style={styles.registerButton}
              textColor="#00635D"
              onPress={() => navigation.navigate("HomeScreen")}
              disabled={!isFormValid}
            >
              Registrarse
            </Button>

            <TouchableOpacity
              onPress={() => navigation.navigate("SignInScreen")}
            >
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
    width: "100%",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  picker: {
    height: 50,
    color: "#000",
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
    zIndex: -9999999999,
  },
});
