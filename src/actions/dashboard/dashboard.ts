import { petLifeAPI } from './../../config/PetLifeAPI';
import { IDashboard } from "../../interfaces/dashboard/IDashboard";
import { ICategorias } from '../../interfaces/dashboard/ICategorias';
import { Alert } from 'react-native';

export const fetchNoticiasMascotas = async (): Promise<IDashboard[]> => {
    try {
        const res = await petLifeAPI.get<IDashboard[]>("/Consejos");
        return res.data
    } catch (error: any) {
        console.error("Error al obtener noticias sobre la categoría:", error);
    }

    return [];
};

export const fetchCategorias = async (): Promise<ICategorias[]> => {
    try {
        const res = await petLifeAPI.get<ICategorias[]>("/Consejos/Categorias");
        return res.data;
    } catch (error) {
        console.error("Error al obtener las categorias", error)
        return []
    }
}

export const fetchCategoriasById = async(id: string): Promise<IDashboard[]>=>{
    try {
        const res = await petLifeAPI.get<IDashboard[]>(`Consejos/FiltrarPorCategoria?categoryId=${id}`)
        return res.data
    } catch (error) {
        Alert.alert("Error", 'No se encontraron consejos en esa categoria')
        return []
    }
}

export const fetchTipoById = async(id:string): Promise<IDashboard[]> => {
    try {
        const res = await petLifeAPI.get<IDashboard[]>(`Consejos/FiltrarPorTipo?tipoId=${id}`)
        return res.data
    } catch (error) {
        Alert.alert("Error", 'No se encontraron noticias para ese tipo de mascotas')
        return []
    }
}