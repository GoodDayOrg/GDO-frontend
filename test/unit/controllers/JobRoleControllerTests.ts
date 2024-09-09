import * as JobRoleController from '../../../src/controllers/JobRoleController';
import * as JobRoleService from '../../../src/services/JobRoleService';
import { expect } from 'chai';
import { JobRoleResponse } from '../../../src/models/JobRoleResponse';
import sinon from 'sinon';
import { afterEach, describe, it } from 'node:test';
import express from 'express';
import { JobRoleDetailsResponse } from '../../../src/models/JobRoleDetailsResponse';

const jobRoleResponse: JobRoleResponse = {
  jobRoleId: 1,
  roleName: 'delivery_master',
  jobRoleLocation: 'Buenos Aires',
  capabilityName: 'delivery',
  bandName: 'Architect',
  closingDate: new Date('10/10/2024'),
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
  });

  describe('getJobRoles', function () {
    it('should render view with job roles when job roles returned', async () => {
      const jobRolesList = [jobRoleResponse];

      sinon.stub(JobRoleService, 'getAllJobRoles').resolves(jobRolesList);

      const req = {
        session: {
          token: 'token',
        },
      };
      const res = { render: sinon.spy() } as MockResponse;

      await JobRoleController.getJobRoles(
        req as unknown as express.Request,
        res,
      );

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('job-role-list', { jobRoles: jobRolesList }))
        .to.be.true;
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
      };
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
        session: {
          token: 'token',
        },
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
      } as MockResponse;

      await JobRoleController.getSingleJobRole(req, res);

      const currentId = req.params.id;
      const nextId = 2;
      const prevId = 0;

      expect(res.render.calledOnce).to.be.true;
      expect(
        res.render.calledWith('job-role-details', {
          jobRole: jobRoleDetails,
          currentId,
          nextId,
          prevId,
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
});
