import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from '../screens/home/HomeScreen';
import { LoadingScreen } from "../screens/loading/LoadingScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { InicioScreen } from '../screens/inicio/InicioScreen';
import { CodigoPostal } from '../screens/auth/CodigoPostalScreen';
import { FormCitasScreen } from '../screens/citas/FormCitasScreen';
import { CategoryNewsScreen } from '../screens/dashboard/CategoryNewsScreen';
import { FormMascota } from "../screens/perfil/FormMascota";

export type RootStackParams = {
    LoadingScreen: undefined;
    SignInScreen: undefined;
    SignUpScreen: undefined;
    InicioScreen: undefined;
    HomeScreen: undefined;
    CodigoPostal: undefined;
    FormCitasScreen: undefined;
    FormMascota: undefined;
    CategoryNewsScreen: {category:string};
};

const Stack = createNativeStackNavigator<RootStackParams>();

export const StackNavigator = () => {
    return (
        <Stack.Navigator
        initialRouteName="FormMascota"
        screenOptions={{ headerShown: false }}
        >
        <Stack.Screen
            name="LoadingScreen"
            options={{ animation: "fade_from_bottom" }}
            component={LoadingScreen}
        />
        <Stack.Screen name="InicioScreen" component={InicioScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CodigoPostal" component={CodigoPostal} />
        <Stack.Screen name="FormCitasScreen" component={FormCitasScreen}/>
        <Stack.Screen name="CategoryNewsScreen" component={CategoryNewsScreen}/>
        <Stack.Screen name="FormMascota" component={FormMascota}/>

        </Stack.Navigator>
    );
};