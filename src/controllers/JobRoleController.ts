import express from 'express';
import {
  getAllJobRoles,
  getJobRoleById,
  postApplyFileForm,
} from '../services/JobRoleService';

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

export const getSingleJobRole = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const applications = [
      {
        jobRoleId: 1,
        roleName: 'Tester',
        statusApplicationName: 'in progress',
      },
    ];

    const currentId = parseInt(req.params.id, 10);
    const nextId = currentId + 1;
    const prevId = currentId - 1;
    const jobRole = await getJobRoleById(
      req.params.id,
      req.session.token,
      'Failed to get job role details.',
    );
    res.render('job-role-details', {
      jobRole,
      currentId,
      nextId,
      prevId,
      applications,
    });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-role-details');
  }
};

export const getJobApplyForm = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const currentId = parseInt(req.params.id, 10);
    const jobRole = await getJobRoleById(
      req.params.id,
      req.session.token,
      'Failed to get job apply form.',
    );

    // const applications need to be change for method from US053
    const applications = [
      {
        jobRoleId: '1',
        roleName: 'Tester',
        statusApplicationName: 'in progress',
      },
      {
        jobRoleId: '2',
        roleName: 'Tester',
        statusApplicationName: 'rejected',
      },
    ];

    res.render('job-apply-form', {
      currentId,
      jobRole,
      applications,
    });
  } catch (e) {
    res.locals.errormessage = e.message;
    res.render('job-apply-form');
  }
};

export const postJobApplyForm = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    await postApplyFileForm(req.session.token, req.params.id, req.file);
    res.redirect(`/job/${req.params.id}`);
  } catch (e) {
    const backURL = req.header('Referer') || '/';
    res.locals.errormessage = e.message;
    res.redirect(backURL);
  }
};
