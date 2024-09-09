import express from 'express';
import {
  getFilteredJobRoles,
  getJobRoleById,
  getAllJobRoles,
} from '../services/JobRoleService';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import { extractJobRoleFilterParams } from '../utils/JobRoleUtil';
import { JobRoleResponse } from '../models/JobRoleResponse';

export const getJobRolesFiltered = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const filters: JobRoleFilterParams = extractJobRoleFilterParams(req);
    const jobRoles = await getFilteredJobRoles(req.session.token, filters);
    req.session.jobRoles = jobRoles;

    res.render('job-role-list', { jobRoles, filters });
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
    const jobRoles = await getAllJobRoles(req.session.token);
    req.session.jobRoles = jobRoles;
    res.render('job-role-list', {
      jobRoles,
      filters: {},
    });
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
    const jobRoles = req.session.jobRoles;
    const currentIndex = jobRoles.findIndex(
      (jobRole: JobRoleResponse) => jobRole.jobRoleId === currentId,
    );

    if (currentIndex === -1) {
      throw new Error('Job role not found in filtered list.');
    }

    const jobRole = await getJobRoleById(req.params.id, req.session.token);
    const prevId =
      currentIndex > 0
        ? jobRoles[currentIndex - 1].jobRoleId
        : jobRoles[jobRoles.length - 1].jobRoleId;
    const nextId =
      currentIndex < jobRoles.length - 1
        ? jobRoles[currentIndex + 1].jobRoleId
        : jobRoles[0].jobRoleId;
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
