import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.BACKEND_APP_URL}/job-roles`);
        return response.data;
    } catch (e) {
        console.log(e);
        throw new Error('Failed to get job-roles');
    }
} 