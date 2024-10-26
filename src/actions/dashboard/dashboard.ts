import { petLifeAPI } from './../../config/PetLifeAPI';
import { IDashboard } from "../../interfaces/dashboard/IDashboard";

export const fetchNoticiasMascotas = async (): Promise<IDashboard[]> => {
    try {
        const res = await petLifeAPI.get<IDashboard[]>("/Consejos");
        console.log("Respuesta del servidor", res.data)
        return res.data
    } catch (error: any) {
        console.error("Error al obtener noticias sobre la categoría:", error);
    }

    return [];
};

