import express from 'express';
import { getFilteredJobRoles , getAllJobRoles } from '../services/JobRoleService';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import { extractJobRoleFilterParams } from '../utils/JobRoleUtil';

export const getJobRolesFiltered = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const filters: JobRoleFilterParams = extractJobRoleFilterParams(req);
    const jobRoles = await getFilteredJobRoles(filters);
    
    res.render('job-role-list', { jobRoles });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-list');
  }
};

export const getJobRoles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const jobRoles = await getAllJobRoles();
    
    res.render('job-role-list', { jobRoles });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-list');
  }
};


