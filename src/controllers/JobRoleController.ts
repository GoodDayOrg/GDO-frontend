import express from 'express';
import { getAllJobRoles, getMyAllApplications } from '../services/JobRoleService';

export const getJobRoles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    res.render('job-role-list', { jobRoles: await getAllJobRoles() });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-list');
  }
};

export const getMyApplications = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    res.render('my-job-applications', { applications: await getMyAllApplications() });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('my-job-applications');
  }
};
