import { AxiosResponse } from "axios";
import { LoginRequest } from "../models/LoginRequest";
import { axiosInstance } from "../config";

export const getToken = async (loginRequest: LoginRequest): Promise<string> => {
    try {
        const response: AxiosResponse = await axiosInstance.post("/api/auth/login", loginRequest);
        return response.data;
    } catch (e) {
        throw new Error(e.response.data);
    }
}
