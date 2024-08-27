import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axios.get(`${process.env.BACKEND_APP_URL}/job-roles`);
        return response.data;
        // const data: JobRoleResponse[] = [
        //     {
        //         jobRoleId: 1,
        //         roleName: "rola",
        //         location: "polska",
        //         capabilityId: 1,
        //         bandId: 1,
        //         closingDate: new Date()
        //     },
        //     {
        //         jobRoleId: 2,
        //         roleName: "rolaqqq",
        //         location: "polska",
        //         capabilityId: 1,
        //         bandId: 1,
        //         closingDate: new Date()
        //     },
        //     {
        //         jobRoleId: 3,
        //         roleName: "roladdfgdfgdf",
        //         location: "polska",
        //         capabilityId: 1,
        //         bandId: 1,
        //         closingDate: new Date()
        //     }
        // ];
        // return data;
    } catch (e) {
        console.log(e);
        throw new Error('Failed to get job-roles');
    }
} 