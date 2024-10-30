export interface IAuthState {
    status: "checking" | "authenticated" | "not-authenticated";
    token: string | null;
    userId: string | null;
    nombre: string | null;
    apellido: string | null;
    login: (token: string) => void;
    logout: () => void;
    checkAuthStatus: () => void;
    setUserData: (token: string) => void
}