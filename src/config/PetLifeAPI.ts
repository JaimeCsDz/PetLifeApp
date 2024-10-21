import axios from "axios";
import { NEWS_API_TOKEN } from '@env';

const newsApi = axios.create({
    baseURL: "https://newsapi.org/v2",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NEWS_API_TOKEN}`,
    },
});

export default newsApi;
