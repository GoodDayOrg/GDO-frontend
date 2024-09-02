import axios, { AxiosResponse } from 'axios';
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
  const test = {
    jobRoleId: 1,
    roleName: 'Delivery Manager',
    jobRoleLocation: 'Gdansk',
    capabilityName: 'Platforms',
    bandName: 'Trainee',
    closingDate: new Date(Date.now()),
    description: 'Somedescription ajkladslkasdkasd kljadskljdaskl',
    responsibilities: 'lorem, ipsum',
    sharepointUrl: 'google.com',
    status: 'open',
    numberOfOpenPositions: 5,
  };
  try {
    // const response: AxiosResponse = await axios.get('/api/job/' + id)
    // return response.data;
    return test;
  } catch (e) {
    throw new Error('Failed to get job role details.');
  }
};
