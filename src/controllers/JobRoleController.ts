import express from 'express';
import { getAllJobRoles, getJobRoleById } from '../services/JobRoleService';

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

export const getSingleJobRole = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const currentId = parseInt(req.params.id, 10);
    const nextId = currentId + 1;
    const prevId = currentId - 1;
    const jobRole = await getJobRoleById(req.params.id);
    res.render('job-role-details', {
      jobRole,
      currentId,
      nextId,
      prevId,
    });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-details');
  }
};
