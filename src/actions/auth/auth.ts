import { petLifeAPI } from './../../config/PetLifeAPI';
import type {
    IAuthRequest,
    IAuthResponse,
} from "../../interfaces";
import { ResponseHelper } from "../../models";

export const authLogin = async (authRequest: IAuthRequest): Promise<ResponseHelper<IAuthResponse>> => {
    let response = new ResponseHelper<IAuthResponse>();

    await petLifeAPI.post<ResponseHelper<IAuthResponse>>(`/Auth/login`, authRequest)
        .then((res) => {
            response = res.data;
        })
        .catch((error) => {
            console.error("Error en la respuesta del servidor:", error.response?.data || error.message);
            response = error.response?.data || { isSuccess: false, message: "Error desconocido" };
        });

    return response;
};

