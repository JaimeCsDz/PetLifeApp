import { create } from "zustand";

interface AuthState {
    status: "checking" | "authenticated" | "not-authenticated";
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    status: "checking",
    token: null, 

    login: (token: string) =>
        set({
        status: "authenticated",
        token,
        }),

    logout: () =>
        set({
        status: "not-authenticated",
        token: null,
        }),
}));