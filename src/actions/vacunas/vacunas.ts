import { IVacunas } from './../../interfaces/vacunas/IVacunas';
import { petLifeAPI } from "../../config/PetLifeAPI";
import { ITipoMascota } from '../../interfaces/Mascota/ITipoMascota';
import { Alert } from 'react-native';
import { ResponseHelper } from "../../models";
import { AxiosError } from 'axios';
import { IEstatus } from '../../interfaces/vacunas/IEstatus';
import { IVacunaTipo } from '../../interfaces/vacunas/IVacunaTipo';


export const getTipoMascota = async(): Promise<ITipoMascota[]> =>{
    try {
        const res = await petLifeAPI.get<ITipoMascota[]>('/TipoMascota')
        return res.data
    } catch (error) {
        console.error("Error al obtener los tipos de mascotas", error)
        return []
    }
}

export const getEstatus = async (): Promise<IEstatus[]> => {
    try {
        const res = await petLifeAPI.get<IEstatus[]>('/Estatus')
        return res.data
    } catch (error) {
        console.error("Error al obtener los tipos de mascota")
        return []
    }
}
export const geVacunasTipoMascota = async (especie: string): Promise<IVacunaTipo[]> => {
    try {
        const res = await petLifeAPI.get<IVacunaTipo[]>('/VacunasTipoMascota');
        const filteredVacunas = res.data.filter(vacuna => vacuna.idTipoMascota === especie);
        return filteredVacunas;
    } catch (error) {
        console.error("Error al obtener los tipos de vacunas");
        return [];
    }
};

export const fetchVacunasById = async(id: string): Promise<IVacunas[]>=>{
    try {
        const res = await petLifeAPI.get<IVacunas[]>(`Vacunas/mascota/${id}`)
        console.log("respuesta", res.data)
        return res.data
    } catch (error) {
        Alert.alert("Error", 'No se encontraron vacunas registradas')
        return []
    }
}

export const PostVacunasMascora = async (vacunaData: IVacunas) => {
    const response = new ResponseHelper<IVacunas>();
try {
    const res = await petLifeAPI.post('/Vacunas', vacunaData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.status === 200 || res.status === 201) {
        response.isSuccess = true;
        response.message = "vacuna registrada con éxito";
        response.data = res.data;
    } else {
        response.isSuccess = false;
        response.message = "Error al registrar la vacuna";
    }
} catch (error) {
    response.isSuccess = false;
        response.message = "Error en la solicitud de registro";
        response.data = undefined;

        if (error instanceof AxiosError) {
            console.error("Error al registrar la vacuna (detalles):", error.response?.data || error.message);
        } else {
            console.error("Error desconocido al registrar la vacuna:", error);
        }
}
return response
}

