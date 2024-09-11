import * as JobRoleController from '../../../src/controllers/JobRoleController';
import * as JobRoleService from '../../../src/services/JobRoleService';
import { expect } from 'chai';
import { JobRoleResponse } from '../../../src/models/JobRoleResponse';
import sinon from 'sinon';
import { afterEach, describe, it } from 'node:test';
import express from 'express';
import { JobRoleDetailsResponse } from '../../../src/models/JobRoleDetailsResponse';
import { MyApplicationsResponse } from '../../../src/models/MyApplicationsResponse';

const jobRolesIds = [1, 2, 3];

const jobRoleResponse: JobRoleResponse = {
  jobRoleId: 1,
  roleName: 'delivery_master',
  jobRoleLocation: 'Buenos Aires',
  capabilityName: 'delivery',
  bandName: 'Architect',
  closingDate: new Date('10/10/2024'),
  statusName: 'open',
};

const jobRoleDetailsResponse: JobRoleDetailsResponse = {
  jobRoleId: 1,
  roleName: 'Tester',
  jobRoleLocation: 'Helsinki',
  capabilityName: 'Business Development & Marketing',
  bandName: 'Apprentice',
  closingDate: new Date('10/10/2024'),
  statusName: 'open',
  description:
    'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.',
  responsibilities:
    'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo.',
  sharepointUrl: 'https://cdc.gov/metus/sapien/ut/nunc/vestibulum.js',
  numberOfOpenPositions: 3,
};

const myApplicationsResponse: MyApplicationsResponse = {
  jobRoleId: 1,
  roleName: 'Tester',
  statusApplicationName: 'hired',
};

interface MockResponse extends express.Response {
  render: sinon.SinonSpy;
  redirect: sinon.SinonSpy;
  locals: {
    errormessage?: string;
  };
}

describe('JobRoleContoller', function () {
  afterEach(() => {
    sinon.restore();
    //sinon.reset();
  });

  describe('getJobRoles', function () {
    it('should render view with job roles when job roles returned', async () => {
      const jobRolesList = [jobRoleResponse];

      sinon.stub(JobRoleService, 'getAllJobRoles').resolves(jobRolesList);

      const req = {
        query: {},

        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = { render: sinon.spy() } as MockResponse;

      await JobRoleController.getJobRoles(
        req as unknown as express.Request,
        res,
      );

      expect(res.render.calledOnce).to.be.true;
      expect(
        res.render.calledWith('job-role-list', {
          jobRoles: jobRolesList,
          filters: {},
        }),
      ).to.be.true;
    });

    it('should render view with error message when error thrown', async () => {
      const errorMessage: string = 'Error message';
      sinon
        .stub(JobRoleService, 'getAllJobRoles')
        .rejects(new Error(errorMessage));

      const req = {
        session: {
          token: 'token',
        },

        query: {},
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.getJobRoles(
        req as unknown as express.Request,
        res,
      );

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('job-role-list')).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('getSingleJobRole', function () {
    it('should render view with details of job role', async () => {
      const jobRoleDetails = jobRoleDetailsResponse;
      sinon.stub(JobRoleService, 'getJobRoleById').resolves(jobRoleDetails);

      const req = {
        params: { id: 1 },
        session: { token: 'token', jobRolesIds, filters: {} },
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
        locals: {},
      } as MockResponse;

      await JobRoleController.getSingleJobRole(req, res);

      const currentId = parseInt(req.params.id, 10);
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

      expect(res.render.calledOnce).to.be.true;
      expect(
        res.render.calledWith('job-role-details', {
          jobRole: jobRoleDetails,
          currentId,
          nextId,
          prevId,
          filters: {},
          queryString: '',
        }),
      ).to.be.true;
    });

    it('should return error view, when id is invalid', async () => {
      const errorMessage: string = 'Failed to get job role details.';
      sinon
        .stub(JobRoleService, 'getJobRoleById')
        .rejects(new Error(errorMessage));

      const req = {
        params: { id: 1 },
        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.getSingleJobRole(req as express.Request, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('job-role-details')).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('getSingleJobRole', function () {
    it('should render view with form of job role application', async () => {
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
      const jobRoleDetails = jobRoleDetailsResponse;
      sinon.stub(JobRoleService, 'getJobRoleById').resolves(jobRoleDetails);

      const req = {
        params: { id: 1 },
        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
      } as MockResponse;

      await JobRoleController.getJobApplyForm(req, res);

      const currentId = req.params.id;

      expect(res.render.calledOnce).to.be.true;
      expect(
        res.render.calledWith('job-apply-form', {
          currentId,
          jobRole: jobRoleDetails,
          applications,
        }),
      ).to.be.true;
    });

    it('should return error view, when id is invalid', async () => {
      const errorMessage: string = 'Failed to get job apply form.';
      sinon
        .stub(JobRoleService, 'getJobRoleById')
        .rejects(new Error(errorMessage));

      const req = {
        params: { id: 1 },
        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.getJobApplyForm(req as express.Request, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('job-apply-form')).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('postJobApplyForm', function () {
    it('should redirect to job detail page after succesful applications process', async () => {
      const jobRoleDetails = jobRoleDetailsResponse;
      sinon.stub(JobRoleService, 'postApplyFileForm').resolves(jobRoleDetails);

      const req = {
        params: { id: 1 },
        body: {
          file: new File(['dummy content'], 'test.pdf', {
            type: 'application/pdf',
          }),
        },
        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = { redirect: sinon.spy() } as MockResponse;

      await JobRoleController.postJobApplyForm(req, res);
      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/job/1')).to.be.true;
    });

    it('should redirect to job application form page after unsuccesful applications process', async () => {
      const errorMessage: string = 'Failed to post job apply form.';
      sinon
        .stub(JobRoleService, 'postApplyFileForm')
        .rejects(new Error(errorMessage));

      const req = {
        params: { id: 1 },
        body: {
          file: new File(['dummy content'], 'test.pdf', {
            type: 'application/pdf',
          }),
        },
        session: {
          token: 'token',
        },
        headers: {
          referer: 'http://localhost:3000/apply/1',
        },
        header: function (name: string) {
          return this.headers[name.toLowerCase()];
        },
      } as unknown as express.Request;
      const res = {
        redirect: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.postJobApplyForm(req, res);
      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('http://localhost:3000/apply/1')).to.be
        .true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('postBulkImportRoles', function () {
    it('should redirect to job list page after succesful csv import', async () => {
      sinon.stub(JobRoleService, 'postBulkImportJobRoles').resolves();

      const req = {
        params: { id: 1 },
        body: {
          file: new File(['dummy content'], 'test.csv', {
            type: 'text/csv',
          }),
        },
        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = { redirect: sinon.spy() } as MockResponse;

      await JobRoleController.postBulkImportRoles(req, res);
      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/job-roles')).to.be.true;
    });

    it('should render bulk import roles form page after unsuccesful importing process', async () => {
      const errorMessage: string = 'Failed to upload job roles.';
      sinon
        .stub(JobRoleService, 'postBulkImportJobRoles')
        .rejects(new Error(errorMessage));

      const req = {
        params: { id: 1 },
        body: {
          file: new File(['dummy content'], 'test.csv', {
            type: 'text/csv',
          }),
        },
        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.postBulkImportRoles(req, res);
      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('bulk-import-roles')).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('getJobRolesFiltered', function () {
    it('should render view with job roles when filtered job roles returned', async () => {
      const jobRolesList = [jobRoleResponse];

      sinon.stub(JobRoleService, 'getFilteredJobRoles').resolves(jobRolesList);

      const req = {
        session: {
          token: 'token',
          jobRoles: [],
          filters: {},
        },
        query: {
          jobRoleLocation: ['Belfast', 'Buenos Aires'],
        },
      } as unknown as express.Request;

      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.getJobRoles(req as express.Request, res);

      expect(res.render.calledOnce).to.be.true;
      expect(
        res.render.calledWith('job-role-list', {
          jobRoles: jobRolesList,
          filters: { jobRoleLocation: ['Belfast', 'Buenos Aires'] },
        }),
      ).to.be.true;
    });

    it('should render view with error message when error thrown', async () => {
      const errorMessage: string = 'Error message';
      sinon
        .stub(JobRoleService, 'getFilteredJobRoles')
        .rejects(new Error(errorMessage));

      const req = {
        session: {
          token: 'token',
        },
      } as unknown as express.Request;

      req.query = {
        roleName: 'Test',
        location: ['Belfast', 'Buenos Aires'],
      };
      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' },
      } as MockResponse;

      await JobRoleController.getJobRoles(req as express.Request, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('job-role-list')).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('getMyAllApplications', function () {
    it('should render view with job application list', async () => {
      const applicationsList = [myApplicationsResponse];

      sinon
        .stub(JobRoleService, 'getMyAllApplications')
        .resolves(applicationsList);

      const req = {
        query: {},

        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = { render: sinon.spy() } as MockResponse;

      await JobRoleController.getMyApplications(req, res);

      expect(res.render.calledOnce).to.be.true;
      expect(
        res.render.calledWith('my-job-applications', {
          applications: applicationsList,
        }),
      ).to.be.true;
    });

    it('should render view with error message'),
      async () => {
        const errorMessage: string = 'Error message';
        sinon
          .stub(JobRoleService, 'getMyAllApplications')
          .rejects(new Error(errorMessage));

        const req = {
          session: {
            token: 'token',
          },

          query: {},
        } as unknown as express.Request;
        const res = {
          render: sinon.spy(),
          locals: { errormessage: '' },
        } as MockResponse;

        await JobRoleController.getJobRoles(req, res);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('my-job-applications')).to.be.true;
        expect(res.locals.errormessage).to.equal(errorMessage);
      };
  });
});
