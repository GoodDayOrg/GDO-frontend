import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { JobRoleDetailsResponse } from '../models/JobRoleDetailsResponse';
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

export const getJobRoleById = async (
  id: string,
  token: string,
  errorMessage: string,
): Promise<JobRoleDetailsResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(
      '/api/job-roles/' + id,
      getHeader(token),
    );
    return response.data;
  } catch (e) {
    throw new Error(errorMessage);
  }
};

export const postApplyFileForm = async (
  token: string,
  id: string,
  file: Express.Multer.File,
): Promise<JobRoleDetailsResponse> => {
  try {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File is bigger than 5MB');
    }
    const blob = new Blob([file.buffer], { type: file.mimetype });
    const formData = new FormData();
    formData.append('file', blob, file.originalname);
    const response: AxiosResponse = await axiosInstance.post(
      `/api/job-roles/${id}/applications`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getHeader(token).headers,
        },
      },
    );
    return response.data;
  } catch (e) {
    throw new Error('Failed to post job apply form.');
  }
};
