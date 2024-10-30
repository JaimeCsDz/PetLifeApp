import { petLifeAPI } from "../../config/PetLifeAPI";
import { ITipoMascota } from '../../interfaces/Mascota/ITipoMascota';

export const getTipoMascota = async(): Promise<ITipoMascota[]> =>{
    try {
        const res = await petLifeAPI.get<ITipoMascota[]>('/TipoMascota')
        return res.data
    } catch (error) {
        console.error("Error al obtener los tipos de mascotas", error)
        return []
    }
}