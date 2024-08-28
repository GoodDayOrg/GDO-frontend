import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
import { axiosInstance, httpsAgent } from "../config";

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axiosInstance.get("/api/job-roles", { httpsAgent });
        return response.data;
    } catch (e) {
        throw new Error('Failed to get job-roles');
    }
}
