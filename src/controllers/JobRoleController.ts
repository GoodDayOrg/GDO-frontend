import express, { application } from 'express';
import {
  getFilteredJobRoles,
  getJobRoleById,
  getAllJobRoles,
  getMyAllApplications,
  postBulkImportJobRoles,
} from '../services/JobRoleService';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import { extractJobRoleFilterParams } from '../utils/JobRoleUtil';

export const getJobRolesFiltered = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const filters: JobRoleFilterParams = extractJobRoleFilterParams(req);
    const jobRoles = await getFilteredJobRoles(req.session.token, filters);

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
  try {
    res.render('my-job-applications', {
      applications: await getMyAllApplications(req.session.token),
    });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('my-job-applications');
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
    const jobRole = await getJobRoleById(req.params.id, req.session.token);
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

export const getBulkImportRoles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  res.render('bulk-import-roles');
};

export const postBulkImportRoles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    await postBulkImportJobRoles(req.session.token, req.body.customCSVInput);
    res.redirect('/job-roles');
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('bulk-import-roles');
  }
};
