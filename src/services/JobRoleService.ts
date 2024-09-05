import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { MyApplicationsResponse, JobRoleDetailsResponse} from '../models/MyApplicationsResponse';
import { getHeader } from '../utils/AuthUtil';

export const getAllJobRoles = async (
  token: String,
): Promise<JobRoleResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(
      '/api/job-roles',
      getHeader(token),
    );
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
  }}
  
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
