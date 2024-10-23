import { petLifeAPI } from '../../config/PetLifeAPI'; // Ajusta la ruta si es necesario
import { ResponseHelper } from '../../models'; // Asegúrate de que la ruta sea correcta
import { IGeneroDto } from '../../interfaces'; // Ajusta la ruta

export const getGeneros = async (): Promise<ResponseHelper<IGeneroDto[]>> => {
  let response = new ResponseHelper<IGeneroDto[]>();

  try {
    const res = await petLifeAPI.get<ResponseHelper<IGeneroDto[]>>('/Genero');
    response = res.data;
  } catch (error) {
    console.error('Error en la respuesta del servidor:', error);
    response = { isSuccess: false, message: 'Error desconocido' };
  }

  return response;
};
