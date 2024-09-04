import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { MyApplicationsResponse } from '../models/MyApplicationsResponse';

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/api/job-roles');
    return response.data;
  } catch (e) {
    throw new Error('Currently no job-roles available');
  }
};

export const getMyAllApplications = async (): Promise<MyApplicationsResponse[]> => { // do zmiany struktura MyApplicationsResponse
  try {
    const response: AxiosResponse = await axiosInstance.get('/api/job-roles'); // do zmiany api url
    return response.data;
  } catch (e) {
    throw new Error("Currently You don't have any applications");
  }
};
