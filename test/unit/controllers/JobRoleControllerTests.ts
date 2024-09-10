import * as JobRoleController from '../../../src/controllers/JobRoleController';
import * as JobRoleService from '../../../src/services/JobRoleService';
import { expect } from 'chai';
import { JobRoleResponse } from '../../../src/models/JobRoleResponse';
import sinon from 'sinon';
import { afterEach, describe, it } from 'node:test';
import express from 'express';
import { JobRoleDetailsResponse } from '../../../src/models/JobRoleDetailsResponse';

const jobRoles = [
  { jobRoleId: 1 },
  { jobRoleId: 2 },
  { jobRoleId: 3 },
] as JobRoleResponse[];

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
  locals: {
    errormessage: string;
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

      await JobRoleController.getJobRoles(req, res);

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

      await JobRoleController.getJobRoles(req, res);

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
        session: { token: 'token', jobRoles, filters: {} },
      } as unknown as express.Request;
      const res = {
        render: sinon.spy(),
        locals: {},
      } as MockResponse;

      await JobRoleController.getSingleJobRole(req, res);

      const currentId = parseInt(req.params.id, 10);
      const currentIndex = jobRoles.findIndex(
        (jobRole) => jobRole.jobRoleId === currentId,
      );
      const nextId =
        currentIndex < jobRoles.length - 1
          ? jobRoles[currentIndex + 1].jobRoleId
          : jobRoles[0].jobRoleId;
      const prevId =
        currentIndex > 0
          ? jobRoles[currentIndex - 1].jobRoleId
          : jobRoles[jobRoles.length - 1].jobRoleId;

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
        session: { token: 'token' },
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

  describe('getJobRolesFiltered', function () {
    it('should render view with job roles when filtered job roles returned', async () => {
      const jobRolesList = [jobRoleResponse];

      sinon.stub(JobRoleService, 'getFilteredJobRoles').resolves(jobRolesList);

      const req = {
        session: {
          token: 'token',
        },
      } as unknown as express.Request;

      req.query = {
        location: ['Belfast', 'Buenos Aires'],
      };
      const res = { render: sinon.spy() } as MockResponse;

      await JobRoleController.getJobRoles(req as express.Request, res);

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
});
