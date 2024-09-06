import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import { JobRoleDetailsResponse } from '../models/JobRoleDetailsResponse';
import { getHeader } from '../utils/AuthUtil';
import { serializeParams } from '../utils/SerializeParams';

export const getFilteredJobRoles = async (
  token: String,
  filters?: JobRoleFilterParams,
): Promise<JobRoleResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(
      '/api/job-roles/filter',
      {
        params: filters,
        paramsSerializer: (params) => serializeParams(params),
        ...getHeader(token),
      },
    );
    return response.data;
  } catch (e) {
    throw new Error('Currently no job-roles available');
  }
};

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
