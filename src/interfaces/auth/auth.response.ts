export interface IAuthResponse {
    userId: string;
    token: string;
    datosPersona: IPersonaAPI;
}
export interface IGeneroDto {
    idGenero: number;
    generos: string;
}

export interface IPersonaAPI {
    nombre: string;
    apPaterno: string;
    apMaterno: string;
    correo: string;
    contraseña: string;
    codigoPostal: string;
    idGenero: string;
}