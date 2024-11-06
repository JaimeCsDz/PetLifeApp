import { petLifeAPI } from "../../config/PetLifeAPI";
import { ICitas } from "../../interfaces/citas/ICitas";
import { AxiosError } from "axios";
import { Alert } from "react-native";
import { ResponseHelper } from "../../models";
import { IVeterinaria } from "../../interfaces/citas/IVeterinaria";
import { IMotivoCitas } from "../../interfaces/citas/IMotivoCitas";
import { ITipoMascota } from "../../interfaces/Mascota/ITipoMascota";
import { IEstatus } from "../../interfaces/vacunas/IEstatus";

export const GetCitasById = async (id: string): Promise<{ data: ICitas[] }> => {
    try {
        const res = await petLifeAPI.get<{ data: ICitas[] }>(`/Cita/obtener-por-mascota/${id}`);
        console.log("respuesta", res.data);
        return res.data;
    } catch (error) {
        Alert.alert("Error", "No se encontraron citas registradas");
        return { data: [] };
    }
};


export const getVeterinarias = async () => {
    try {
        const res = await petLifeAPI.get<IVeterinaria[]>('/Veterinarias');
        console.log('Respuesta del servidor:', res.data); 
        return res.data;
    } catch (error) {
        console.error('Error en la respuesta del servidor:', error);
        return []; 
    }
}

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

export const getMotivosByIdTipo = async (idTipoMascota: string) => {
    try {
        const res = await petLifeAPI.get<IMotivoCitas[]>(`/MotivoCita/tipoMascota/${idTipoMascota}`);
        console.log("Respuesta del servidor:", res.data);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error en la respuesta del servidor:", error.response?.data || error.message);
        } else {
            console.error("Error desconocido:", error);
        }
        return [];
    }
};

export const updateCita = async (id:string, data: {estatu: string, notaAdicional: string}) => {
    try {
        const res = await petLifeAPI.put(`Cita/editar/${id}`, data)
        console.log('respuesta del servidor: ', res.data)
        return res.data
    } catch (error) {
        console.error('A ocurrido un error al editar la cita: ', error)
        return []
    }
}


export const PostCitasMascotas = async(citaData: ICitas) =>{
    const response = new ResponseHelper<ICitas>()
    try{
        const res = await petLifeAPI.post('/Cita/crear', citaData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(res.status === 200 || res.status === 201){
            response.isSuccess = true;
            response.message = "cita registrada con éxito";
            response.data = res.data;
        }else {
            response.isSuccess = false;
            response.message = "Error al registrar la cita";
        }
    }catch(error){
        response.isSuccess = false;
        response.message = "Error en la solicitud de registro";
        response.data = undefined;

        if (error instanceof AxiosError) {
            console.error("Error al registrar la cita (detalles):", error.response?.data || error.message);
        } else {
            console.error("Error desconocido al registrar la cita:", error);
        }
    }
    return response
}