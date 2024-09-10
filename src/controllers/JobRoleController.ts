import qs from 'qs';
import express, { application } from 'express';
import {
  getFilteredJobRoles,
  getJobRoleById,
  getAllJobRoles,
  getMyAllApplications,
} from '../services/JobRoleService';
import { JobRoleFilterParams } from '../models/JobRoleFilterParams';
import { extractJobRoleFilterParams } from '../utils/JobRoleUtil';
import { JobRoleResponse } from '../models/JobRoleResponse';

export const getJobRoles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const filters: JobRoleFilterParams = extractJobRoleFilterParams(req);
  req.session.filters = filters;
  let jobRoles: JobRoleResponse[] = req.session.jobRoles || [];

  try {
    if (Object.keys(filters).length === 0 && jobRoles.length > 0) {
      return res.render('job-role-list', { jobRoles, filters });
    }

    jobRoles =
      Object.keys(filters).length > 0
        ? await getFilteredJobRoles(req.session.token, filters)
        : await getAllJobRoles(req.session.token);

    req.session.jobRoles = jobRoles;
    res.render('job-role-list', { jobRoles, filters });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-list', { jobRoles, filters });
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
    const { id } = req.params;
    const { jobRoles = [], token, filters } = req.session;
    const currentId = parseInt(id, 10);

    let currentIndex = 0;
    let nextId = 0;
    let prevId = 0;

    if (jobRoles.length > 0) {
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
    }

    const jobRole = await getJobRoleById(id, token);

    res.render('job-role-details', {
      jobRole,
      currentId,
      nextId,
      prevId,
      filters,
      queryString: qs.stringify(filters),
    });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-details');
  }
};
