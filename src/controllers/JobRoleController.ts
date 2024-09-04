import express from 'express';
import { getAllJobRoles } from '../services/JobRoleService';

export const getJobRoles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    res.render('job-role-list', {
      jobRoles: await getAllJobRoles(req.session.token),
    });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-list');
  }
};
