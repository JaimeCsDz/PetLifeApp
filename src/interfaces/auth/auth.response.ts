export interface IAuthResponse {
    userId: string;
    token: string;
    datosPersona: IPersonaAPI;
}

export interface IPersonaAPI {
    personaId: string;
    nombre: string;
    apellidopaterno: string;
    apellidomaterno: string,
    email: string;
    genero: string;
}