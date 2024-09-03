import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { JobRoleDetailsResponse } from '../models/JobRoleDetailsResponse';

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/api/job-roles');
    return response.data;
  } catch (e) {
    throw new Error('Currently no job-roles available');
  }
};

export const getJobRoleById = async (
  id: string,
): Promise<JobRoleDetailsResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(
      '/api/job-roles/' + id,
    );
    return response.data;
  } catch (e) {
    throw new Error('Failed to get job role details.');
  }
};
