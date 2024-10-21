import newsApi from "../../config/PetLifeAPI";
import { API_DASHBOARD } from "@env";

export interface IArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
    }

export interface IResponseHelper<T> {
    data?: T;
    isSuccess?: boolean;
    message?: string;
}

export const fetchNoticiasMascotas = async (page: number = 1, category: string = 'pets'): Promise<IResponseHelper<IArticle[]>> => {
    const response: IResponseHelper<IArticle[]> = {};

    try {
        const searchQuery = category || 'pets';

        const { data } = await newsApi.get("/everything", {
            params: {
                q: searchQuery,
                apiKey: "dd27e2e8bc3e42019de5d7b28a13647b",
                language: "es",
                pageSize: 10,
                page: page
            }
        });
        response.data = data.articles;
        response.isSuccess = true;
    } catch (error: any) {
        console.error("Error al obtener noticias sobre la categoría:", error);
        response.message = "Error al obtener noticias: " + error.message;
    }

    return response;
};

