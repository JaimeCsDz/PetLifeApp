import { petLifeAPI } from './../../config/PetLifeAPI';
import { ResponseHelper } from '../../models';
import { IMascotas } from '../../interfaces/Mascota/IMascota';
import { IGenero } from '../../interfaces/Mascota/IGenero';
import { IRaza } from '../../interfaces/Mascota/IRaza';
import { ITipoMascota } from '../../interfaces/Mascota/ITipoMascota';
import { AxiosError } from 'axios';
import { IVacunas } from '../../interfaces/vacunas/IVacunas';


export const updateVacuna = async (id: string, vacunaData: IVacunas) => {
    try {
        const res = await petLifeAPI.put(`/Vacunas/${id}`, vacunaData);
        return res.data;
    } catch (error) {
        console.log("Error al actualizar la vacuna", error);
        return null;
    }
};

export const deleteVacuna = async (id:string) => {
    try {
        const res = await petLifeAPI.delete(`/Vacunas/${id}`)
        return res
    } catch (error) {
        console.log("Error al eliminar la vacuna")
        return []
    }
}

export const getMascotasByUserId = async (userId: string): Promise<{ data: IMascotas[]; isSuccess: boolean; message: string | null }> => {
    try {
        const res = await petLifeAPI.get<{ data: IMascotas[]; isSuccess: boolean; message: string | null }>(`/Mascota/obtener-por-usuario/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener las mascotas:", error);
        return { data: [], isSuccess: false, message: "Error al obtener las mascotas" };
    }
};

export const registerMasc = async (mascotaData: IMascotas) => {
    const response = new ResponseHelper<IMascotas>();

    try {
        const res = await petLifeAPI.post('/Mascota/crear', mascotaData, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.status === 200 || res.status === 201) {
            response.isSuccess = true;
            response.message = "Mascota registrada con éxito";
            response.data = res.data;
        } else {
            response.isSuccess = false;
            response.message = "Error al registrar la mascota";
            response.data = undefined;
        }
    } catch (error) {
        response.isSuccess = false;
        response.message = "Error en la solicitud de registro";
        response.data = undefined;

        if (error instanceof AxiosError) {
            console.error("Error al registrar la mascota (detalles):", error.response?.data || error.message);
        } else {
            console.error("Error desconocido al registrar la mascota:", error);
        }
    }

    return response;
};



export const getGeneros = async (): Promise<IGenero[]> => {
    try {
        const res = await petLifeAPI.get<IGenero[]>('/GeneroMascota');
        console.log('Respuesta del servidor:', res.data); 
        return res.data;
    } catch (error) {
        console.error('Error en la respuesta del servidor:', error);
        return []; 
    }
};

export const getRaza = async (): Promise<IRaza[]> => {
    try {
        const res = await petLifeAPI.get<IRaza[]>('/Razas');
        return res.data;
    } catch (error) {
        console.error('Error en la respuesta del servidor:', error);
        return []; 
    }
};

export const getTipoMascota = async (): Promise<ITipoMascota[]> => {
    try {
        const res = await petLifeAPI.get<ITipoMascota[]>('/TipoMascota');
        return res.data;
    } catch (error) {
        console.error('Error en la respuesta del servidor:', error);
        return []; 
    }
};