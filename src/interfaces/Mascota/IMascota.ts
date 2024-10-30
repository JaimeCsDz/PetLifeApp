import { IRaza } from "./IRaza";

export interface IMascotas{
    id?: string;
    fotoMascota: string,
    nombreMascota: string,
    peso: number,
    altura: number,
    fechaNacimiento: string,
    idUsuario: string,
    idTipoMascota: string,
    idGenero: string,
    idRazaMascota: string
}