import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../routes/StackNavigator";
import { PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
    const { status, checkAuthStatus } = useAuthStore(); 

    useEffect(() => {
        checkAuthStatus();

        if (status !== "checking") {
            if (status === "authenticated") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "HomeScreen" }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "InicioScreen" }], 
                });
            }
        }
    }, [status, navigation]);

    return <>{children}</>;
};
