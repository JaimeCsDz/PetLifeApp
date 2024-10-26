import { petLifeAPI } from '../../config/PetLifeAPI';
import { IGeneroDto } from '../../interfaces'; 

export const getGeneros = async (): Promise<IGeneroDto[]> => {
  try {
    const res = await petLifeAPI.get<IGeneroDto[]>('/Genero');
    console.log('Respuesta del servidor:', res.data); 
    return res.data;
  } catch (error) {
    console.error('Error en la respuesta del servidor:', error);
    return []; 
  }
};
