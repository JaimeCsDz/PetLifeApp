import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from '../screens/home/HomeScreen';
import { LoadingScreen } from "../screens/loading/LoadingScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { InicioScreen } from '../screens/inicio/InicioScreen';
import { ProfileScreen } from '../screens/perfil/ProfileScreen';
import { ResourceScreen } from '../screens/recursos/ResourceScreen';
import { MapsScreen } from '../screens/maps/MapsScreen';
import { Citas } from '../screens/citas/Citas';

export type RootStackParams = {
    LoadingScreen: undefined;
    SignInScreen: undefined;
    SignUpScreen: undefined;
    InicioScreen: undefined;
    ProfileScreen: undefined;
    ResourceScreen: undefined;
    MapsScreen: undefined;
    Citas: undefined
    HomeScreen: undefined
};

const Stack = createNativeStackNavigator<RootStackParams>();

export const StackNavigator = () => {
    return (
        <Stack.Navigator
        initialRouteName="InicioScreen"
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
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ResourceScreen" component={ResourceScreen} />
        <Stack.Screen name="Citas" component={Citas} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        </Stack.Navigator>
    );
};