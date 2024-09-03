import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import qs from 'qs';

export const getAllJobRoles = async (filters?: JobRoleFilterParams): Promise<JobRoleResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get('/api/job-roles', {
      params: filters
    });
    return response.data;
  } catch (e) {
    throw new Error('Currently no job-roles available');
  }
};
