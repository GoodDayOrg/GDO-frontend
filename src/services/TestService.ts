import axios, { AxiosResponse } from "axios";
import { API_URL, httpsAgent } from "../config";

const axiosInstance = axios.create({
    baseURL: API_URL
});

export const getDatabases = async (): Promise<string[]> => {
    try {
        const response: AxiosResponse = await axiosInstance.get("/api/test", { httpsAgent });

        return response.data;
    } catch (e) {
        console.log(e);
        throw new Error('Failed to get databases');
    }
}
