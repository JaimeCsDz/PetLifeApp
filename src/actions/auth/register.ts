import { petLifeAPI } from './../../config/PetLifeAPI';
import type { IAuthRequest, IAuthResponse } from '../../interfaces';
import { ResponseHelper } from '../../models';

export const authRegister = async (authRequest: IAuthRequest): Promise<ResponseHelper<IAuthResponse>> => {
  const response = new ResponseHelper<IAuthResponse>();

  try {
    const res = await petLifeAPI.post('/Auth/register', authRequest);
    // Verificar si el status de la respuesta es exitoso
    if (res.status === 200 && res.data.message === 'Usuario registrado exitosamente.') {
      response.isSuccess = true;
      response.message = res.data.message; // Usar el mensaje de la respuesta
      response.data = res.data.token; // Guardar el token si es necesario
    } else {
      response.isSuccess = false;
      response.message = res.data.message || 'Error durante el registro.';
    }
  } catch (error: any) {
    console.error('Error en la respuesta del servidor:', error.response?.data || error.message);
    response.isSuccess = false;
    response.message = error.response?.data?.message || 'Error desconocido';
  }

  return response;
};
