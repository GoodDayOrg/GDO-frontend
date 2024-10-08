import { AxiosResponse } from 'axios';
import { JobRoleResponse } from '../models/JobRoleResponse';
import { axiosInstance } from '../config';
import { MyApplicationsResponse } from '../models/MyApplicationsResponse';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import { getHeader } from '../utils/AuthUtil';
import { serializeParams } from '../utils/SerializeParams';
import { JobRoleDetailsResponse } from '../models/JobRoleDetailsResponse';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

export const getMyAllApplications = async (
  token: String,
): Promise<MyApplicationsResponse[]> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(
      '/api/job-roles/my-job-applications',
      getHeader(token),
    );
    return response.data;
  } catch (e) {
    throw new Error('Currently You dont have any applications');
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
    if (file.size > MAX_FILE_SIZE) {
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

export const postBulkImportJobRoles = async (
  token: String,
  file: Express.Multer.File,
): Promise<void> => {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File is bigger than 5MB');
    }
    const blob = new Blob([file.buffer], { type: file.mimetype || 'text/csv' });
    const formData = new FormData();
    formData.append('file', blob, file.originalname);
    await axiosInstance.post('/api/job-roles/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getHeader(token).headers,
      },
    });
  } catch (e) {
    if (e.message === 'File is bigger than 5MB') {
      throw e;
    } else {
      throw new Error('Failed to upload job roles.');
    }
  }
};
