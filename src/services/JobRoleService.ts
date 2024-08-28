import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";

axios.defaults.baseURL = process.env.BACKEND_APP_URL || 'http://localhost:8080/api';

export const URL: string = "/job-roles";

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axios.get(URL);
        return response.data;
    } catch (e) {
        throw new Error('Failed to get job-roles');
    }
} 