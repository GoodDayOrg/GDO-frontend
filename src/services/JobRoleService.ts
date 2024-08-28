import { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
import { axiosInstance } from "../config";

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axiosInstance.get("/api/job-roles");
        return response.data;
    } catch (e) {
        throw new Error('Failed to get job-roles');
    }
}
