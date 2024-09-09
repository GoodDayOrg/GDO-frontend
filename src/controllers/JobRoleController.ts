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
    const jobRoles = req.session.jobRoles || [];
    let currentIndex;
    let nextId;
    let prevId;

    if (jobRoles.length != 0) {
      currentIndex = jobRoles.findIndex(
        (jobRole: JobRoleResponse) => jobRole.jobRoleId === currentId,
      );
      prevId =
        currentIndex > 0
          ? jobRoles[currentIndex - 1].jobRoleId
          : jobRoles[jobRoles.length - 1].jobRoleId;
      nextId =
        currentIndex < jobRoles.length - 1
          ? jobRoles[currentIndex + 1].jobRoleId
          : jobRoles[0].jobRoleId;
    } else {
      currentIndex = 0;
      nextId = 0;
      prevId = 0;
    }

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
