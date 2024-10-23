import axios from "axios";
import { NEWS_API_TOKEN, API_URL, API_DASHBOARD } from '@env';

export const petLifeAPI = axios.create({
    baseURL: API_URL,
    headers: {"Content-Type": "application/json"},
});

const newsApi = axios.create({
    baseURL: API_DASHBOARD,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NEWS_API_TOKEN}`,
    },
});

export default newsApi;
