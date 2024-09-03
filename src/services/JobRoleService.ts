import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import qs from 'qs';

export const getFilteredJobRoles = async (filters?: JobRoleFilterParams): Promise<JobRoleResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/api/job-roles/filter', {
      params: filters
    });
    return response.data;
  } catch (e) {
    throw new Error('Currently no job-roles available');
  }
};

export const getAllJobRoles = async (): Promise<JobRoleResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/api/job-roles');
    return response.data;
  } catch (e) {
    throw new Error('Currently no job-roles available');
  }
};
