import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { decode as atob } from 'base-64';
import { IAuthState } from "../interfaces/auth/IAuthState";

export const useAuthStore = create<IAuthState>((set) => ({
    status: "checking",
    token: null,
    userId: null,
    nombre: null,
    apellido: null,

    login: (token: string) => {
        set({
            status: "authenticated",
            token,
        });
        useAuthStore.getState().setUserData(token);
    },
    logout: async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            set({
            status: "not-authenticated",
            token: null,
            userId: null,
            nombre: null,
            apellido: null,
            });
        } catch (error) {
            console.error("Error al eliminar el token de AsyncStorage:", error);
        }
    },

    checkAuthStatus: async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            set({
            status: "authenticated",
            token,
            });
            useAuthStore.getState().setUserData(token);
        } else {
            set({
            status: "not-authenticated",
            token: null,
            userId: null,
            nombre: null,
            apellido: null,
            });
        }
    },

    setUserData: (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = atob(base64);
            const decoded = JSON.parse(jsonPayload);
    
            set({
                userId: decoded.id || null,
                nombre: decoded.nombre || null,
                apellido: decoded.apellido || null,
            });
        } catch (error) {
            console.error('Error al decodificar el token:', error);
        }
    },
}));
