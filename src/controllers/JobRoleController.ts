import express from 'express';
import { getAllJobRoles, getMyAllApplications, getJobRoleById} from '../services/JobRoleService';

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

export const getMyApplications = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {   res.render('my-job-applications', { applications: await getMyAllApplications() });
} catch (e) {
  res.locals.errormessage = e.message;
  res.render('my-job-applications');
}};

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
