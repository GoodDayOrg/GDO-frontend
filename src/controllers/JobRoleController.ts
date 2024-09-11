import qs from 'qs';
import express, { application } from 'express';
import {
  getFilteredJobRoles,
  getJobRoleById,
  getAllJobRoles,
  getMyAllApplications,
  getAssesRoleApplications,
  postRoleAssesForm,
  // postRoleHireForm,
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
    req.session.jobRolesIds = jobRoles.map((jobRole) => jobRole.jobRoleId);
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
    const myApplications = await getMyAllApplications(req.session.token);
    const jobRolesIds = myApplications.map(
      (application) => application.jobRoleId,
    );
    req.session.jobRolesIds = jobRolesIds;
    res.render('my-job-applications', {
      applications: myApplications,
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
    const { jobRolesIds = [], token, filters } = req.session;
    const currentId = parseInt(id, 10);

    let currentIndex = 0;
    let nextId = 0;
    let prevId = 0;

    if (jobRolesIds.length > 0) {
      currentIndex = jobRolesIds.indexOf(currentId);

      prevId =
        currentIndex > 0
          ? jobRolesIds[currentIndex - 1]
          : jobRolesIds[jobRolesIds.length - 1];

      nextId =
        currentIndex < jobRolesIds.length - 1
          ? jobRolesIds[currentIndex + 1]
          : jobRolesIds[0];
    }

    const jobRole = await getJobRoleById(id, token);
    const applications = await getAssesRoleApplications(id, token);

    res.render('job-role-details', {
      jobRole,
      applications,
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

export const postAssesForm = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    await postRoleAssesForm(
      req.session.token,
      req.params.id,
      req.body.assesStatus,
      req.body.email,
    );
    res.redirect(`/job/${req.params.id}`);
  } catch (e) {
    const backURL = req.header('Referer') || '/';
    res.locals.errormessage = e.message;
    res.redirect(backURL);
  }
};
