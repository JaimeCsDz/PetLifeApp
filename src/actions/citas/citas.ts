import { petLifeAPI } from "../../config/PetLifeAPI";
import { ICitas } from "../../interfaces/citas/ICitas";
import { AxiosError } from "axios";
import { Alert } from "react-native";

export const GetCitasById = async (id: string): Promise<ICitas[]> => {
    try {
        const res = await petLifeAPI.get<ICitas[]>(`/Cita/obtener-por-mascota/${id}`)
        console.log("respuesta", res.data)
        return res.data
    } catch (error) {
        Alert.alert("Error", "No se encontraron citas registradas")
        return []
    }
}