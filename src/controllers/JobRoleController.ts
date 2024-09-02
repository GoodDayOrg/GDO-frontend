import express from 'express';
import { getAllJobRoles } from '../services/JobRoleService';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import { extractJobRoleFilterParams } from '../utils/JobRoleUtil';

export const getJobRoles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const filters: JobRoleFilterParams = extractJobRoleFilterParams(req);
    const jobRoles = await getAllJobRoles(filters);
    
    res.render('job-role-list', { jobRoles });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-list');
  }
};
